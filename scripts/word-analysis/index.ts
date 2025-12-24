import dotenv from 'dotenv'
import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {updateReedsyDictionaries} from './dictionary';
import {DEFAULT_ACCEPTANCE_THRESHOLD, DEFAULT_WORD_LIMIT} from './constants';
import {runAnalysis, saveAnalysisToFile} from './llm-analysis';
import {removeAnalysedWordsFromQueue, retrieveWords} from './queue';
import {filterExistingWords, takeWordSample} from './filters';
import {logger} from './logger';

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .option('acceptance-threshold', {
    type: 'number',
    default: DEFAULT_ACCEPTANCE_THRESHOLD,
    description: 'Acceptance threshold for word analysis',
  })
  .option('word-limit', {
    type: 'number',
    default: DEFAULT_WORD_LIMIT,
    description: 'Maximum number of words to process',
  })
  .parseSync();

const ACCEPTANCE_THRESHOLD = argv.acceptanceThreshold;
const WORD_LIMIT = argv.wordLimit;

export async function main(): Promise<void> {
  const words = retrieveWords();
  const sample = takeWordSample(words, WORD_LIMIT);
  const filtered = await filterExistingWords(sample);
  const analysis = await runAnalysis(filtered);
  await saveAnalysisToFile(analysis);
  await updateReedsyDictionaries(analysis, ACCEPTANCE_THRESHOLD);
  await removeAnalysedWordsFromQueue(analysis);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    logger.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
