import {HunspellFactory, loadModule} from 'hunspell-asm';
import {readFile, writeFile} from 'fs/promises';
import {WordAnalysis} from './llm-analysis';
import {DICTIONARIES} from './constants';
import {logger} from './logger';

export async function hunspellFactory(): Promise<HunspellFactory> {
  return loadModule();
}

export async function mountDictionary(
  dict: string,
  factory: HunspellFactory,
): Promise<{affFile: string; dictFile: string, reedsyDictFile: string}> {
  const {affBuffer, dictBuffer, reedsyDictBuffer} = await getDictionaryBuffer(dict);
  const flattenedDictName = dict.replaceAll('/', '_');

  return {
    affFile: factory.mountBuffer(affBuffer, `${flattenedDictName}.aff`),
    dictFile: factory.mountBuffer(dictBuffer, `${flattenedDictName}.dic`),
    reedsyDictFile: factory.mountBuffer(reedsyDictBuffer, `${flattenedDictName}.dic`),
  };
}

export function unmountDictionary(
  {aff, dict, reedsyDict}: {aff: string, dict:string, reedsyDict:string},
  factory: HunspellFactory
): void {
  factory.unmount(aff);
  factory.unmount(dict);
  factory.unmount(reedsyDict);
}

async function getDictionaryBuffer(dict: string): Promise<{
  affBuffer: Buffer;
  dictBuffer: Buffer;
  reedsyDictBuffer: Buffer;
}> {
  const [affBuffer, dictBuffer, reedsyDictBuffer] = await Promise.all([
    readFile(`./${dict}.aff`),
    readFile(`./${dict}.dic`),
    readFile(`./${dict}_reedsy.dic`),
  ]);

  return {affBuffer, dictBuffer, reedsyDictBuffer};
}

export async function updateReedsyDictionaries(output: WordAnalysis[], threshold: number) {
  const out: Record<string, Set<string>> = Object.fromEntries(DICTIONARIES.map(dict => [dict, new Set()]));

  output.forEach(word => {
    word.dictionaries.forEach(dict => {
      if (dict.score >= threshold) {
        out[dict.dictionary].add(word.transformedWord);
      }
    });
  });

  const update = await Promise.allSettled(
    DICTIONARIES.map(async dict => {
      if (out[dict].size === 0) return;

      const existingWords = await readDictionaryWords(`./${dict}_reedsy.dic`);
      const mergedWords = mergeAndSortWords(existingWords, Array.from(out[dict]));
      const contents = formatDictionaryFile(mergedWords);

      return writeFile(`./${dict}_reedsy.dic`, contents, 'utf8');
    })
  );

  const updateCount = update.filter(r => r.status === 'fulfilled').length;
  logger.info(`${updateCount} dictionaries out of ${update.length} updated successfully`);

  return output;
}

async function readDictionaryWords(path: string): Promise<string[]> {
  const content = await readFile(path, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  return lines.slice(1); // Skip first line (word count)
}

function mergeAndSortWords(existing: string[], newWords: string[]): string[] {
  const combined = new Set([...existing, ...newWords]);
  return Array.from(combined).sort((a, b) => a.localeCompare(b));
}

function formatDictionaryFile(words: string[]): string {
  return `${words.length}\n${words.join('\n')}\n`;
}
