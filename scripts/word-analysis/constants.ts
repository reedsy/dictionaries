import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

export const DICTIONARIES = ['technical/technical', 'en/en_AU', 'en/en_CA', 'en/en_GB', 'en/en_US', 'en/en_ZA'] as const;
export const MODEL = 'claude-opus-4-5';
export const DEFAULT_WORD_LIMIT = 100;
export const DEFAULT_ACCEPTANCE_THRESHOLD = 0.8;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const WORD_QUEUE_PATH = join(__dirname, 'word-queue.txt');
