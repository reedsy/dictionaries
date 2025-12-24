import {DICTIONARIES} from './constants';

export const SYSTEM_PROMPT = `You are a dictionary word analysis tool.
You accept an array of dictionaries, and an array of words, and determine if each word should be included in that dictionary.
For context, assume that the dictionary is being used for a novel writing app's spellchecker.
To determine if a word is accepted into a dictionary you use the following rules:
- Use an internal scoring mechanism from 0 to 1. 0 means 0% chance of being accepted, 1 means 100% confidence that the word should be added
- Consider each for each dictionary separately; the dictionaries are completely independent
- Infer the relevant country from the dictionary reference, e.g. en/en_GB would be British English
- The "technical" dictionary should only accept brand names, and words applicable to any language
- If a word is valid in the technical dictionary, it should have a score of 0 in all other dictionaries
- If the word is a name of a person, accept it only if it is a commonly used name in the country in question
- If the word is not a proper noun and contains any capital letters, transform it to be all lowercase.`;

export function makePrompt(obj: Record<string, (typeof DICTIONARIES[number])[]>): string {
  return `Consider the following words for the specified dictionaries: ${JSON.stringify(obj)}`;
}
