import {writeFile, mkdir} from 'fs/promises';
import {generateObject} from 'ai';
import z from 'zod';
import {AnthropicProviderOptions, createAnthropic} from '@ai-sdk/anthropic';
import {makePrompt, SYSTEM_PROMPT} from './llm-prompts';
import {DICTIONARIES, MODEL} from './constants';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {logger} from './logger';

const wordAnalysisSchema = z.object({
  word: z.string(),
  transformedWord: z.string(),
  dictionaries: z.array(z.object({
    dictionary: z.enum(DICTIONARIES),
    score: z.number().min(0).max(1),
  }))
});

export type WordAnalysis = z.infer<typeof wordAnalysisSchema>;

export async function runAnalysis(obj: Record<string, (typeof DICTIONARIES[number])[]>): Promise<WordAnalysis[]> {
  const words = Object.keys(obj);
  logger.info(`Running LLM analysis on ${words.length} words for ${DICTIONARIES.length} dictionaries`);

  const anthropic = createAnthropic();

  const {object} = await generateObject({
    model: anthropic(MODEL),
    temperature: 0,
    output: 'array',
    schema: wordAnalysisSchema,
    providerOptions: {
      anthropic: {
        effort: 'high',
      } satisfies AnthropicProviderOptions,
    },
    system: SYSTEM_PROMPT,
    prompt: makePrompt(obj),
  }).catch(err => {
    logger.error(err);
    throw err;
  });

  return object;
}

export async function saveAnalysisToFile(analysis: WordAnalysis[]) {
  const check = z.array(wordAnalysisSchema).safeParse(analysis);

  if (!check.success) {
    logger.error(check.error);
    throw new Error('LLM output did not match required JSON schema');
  }

  const timestamp = getTimestamp();
  logger.info(`Saving analysis to analyses/${timestamp}/analysis.json`);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  await mkdir(join(__dirname, `analyses/${timestamp}`), {recursive: true});
  await writeFile(join(__dirname, `analyses/${timestamp}/analysis.json`), JSON.stringify(analysis, null, 2), 'utf8');

  return analysis;
}

function getTimestamp() {
  return new Date().toISOString().split('.')[0].replaceAll(/[^0-9]/g, '');
}
