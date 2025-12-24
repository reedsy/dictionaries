import {WORD_QUEUE_PATH} from './constants';
import {WordAnalysis} from './llm-analysis';
import {readFileSync} from 'fs';
import {writeFile} from 'fs/promises';
import {logger} from './logger';

export function retrieveWords(): string[] {
  logger.info(`Retrieving words`, {data: {queuePath: WORD_QUEUE_PATH}});

  const words = (readFileSync(WORD_QUEUE_PATH, 'utf8'))
    .split('\n')
    .map(w => w.split(' ')[0].trim())
    .filter(Boolean);

  if (!words?.length) {
    throw new Error('No words found to analyse');
  }

  logger.info(`${words.length} word(s) retrieved`);

  return words;
}

export async function removeAnalysedWordsFromQueue(output: WordAnalysis[]) {
  // We retrieve the words again, in case they have changed
  const baseWords = await retrieveWords();
  const analysed = output.map(({word}) => word);
  const filtered = baseWords.filter(word  => !analysed.includes(word));
  logger.info(`Removing ${baseWords.length - filtered.length} analysed word(s) from base word list`);
  return writeFile(WORD_QUEUE_PATH, filtered.join("\n") + "\n", 'utf8');
}
