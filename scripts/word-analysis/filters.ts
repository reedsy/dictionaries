import {DICTIONARIES} from './constants';
import {hunspellFactory, mountDictionary, unmountDictionary} from './dictionary';
import {logger} from './logger';

export function takeWordSample(words: string[], limit: number): string[] {
  if (words.length > limit) {
    logger.info(`Word count exceeds limit of ${limit}, taking first ${limit} words`);
  }

  return words.slice(0, limit);
}

export async function filterExistingWords(words: string[]): Promise<Record<string, (typeof DICTIONARIES[number])[]>> {
  const factory = await hunspellFactory();
  const filtered = Object.fromEntries(words.map(word => [word, []]));

  for (const dict of DICTIONARIES) {
    const files = await mountDictionary(dict, factory);
    const hunspell = factory.create(files.affFile, files.dictFile);
    hunspell.addDictionary(files.reedsyDictFile);

    words.forEach((word) => {
      if (!hunspell.spell(word)) {
        filtered[word].push(dict);
      }
    });

    unmountDictionary(
      {aff: files.affFile, dict: files.dictFile, reedsyDict: files.reedsyDictFile},
      factory
    );
  }

  return filtered;
}
