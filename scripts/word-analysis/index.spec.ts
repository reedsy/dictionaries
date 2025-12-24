import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {generateObject} from 'ai';
import {readFile, writeFile} from 'fs/promises';
import {readFileSync} from 'fs';

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

import {main} from './index.js';

describe('word analysis script', () => {
  let originalArgv;

  beforeEach(() => {
    originalArgv = process.argv;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.argv = originalArgv;
  });

  it('removes analysed words from the queue and outputs an analysis', async () => {
    const llmOutput = [
      {
        word: 'Hello',
        transformedWord: 'hello',
        dictionaries: [
          {dictionary: 'en/en_AU', score: 1},
          {dictionary: 'en/en_CA', score: 1},
          {dictionary: 'en/en_GB', score: 1},
          {dictionary: 'en/en_US', score: 1},
          {dictionary: 'en/en_ZA', score: 1},
        ]
      }
    ];

    const wordQueueContent = "Hello\n";
    const existingDictContent = "2\napple\nzebra\n";

    vi.mocked(readFileSync).mockImplementation((path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      return '';
    });

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('_reedsy.dic')) {
        return existingDictContent;
      }
      return '';
    });

    vi.mocked(generateObject).mockResolvedValue({
      object: llmOutput
    } as Awaited<ReturnType<typeof generateObject>>);

    await main();

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('word-queue.txt'),
      "\n",
      "utf8"
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('analysis.json'),
      JSON.stringify(llmOutput, null, 2),
      "utf8"
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('en_AU_reedsy.dic'),
      "3\napple\nhello\nzebra\n",
      "utf8"
    );

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('en_US_reedsy.dic'),
      "3\napple\nhello\nzebra\n",
      "utf8"
    );
  });

  it('errors with no words found to analyse', async () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      return '';
    });

    await expect(main()).rejects.toThrowError('No words found to analyse');
  });

  it('handles LLM errors', async () => {
    const wordQueueContent = "Hello\n";

    vi.mocked(readFileSync).mockImplementation((path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      return '';
    });

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('_reedsy.dic')) {
        return "0\n";
      }
      return '';
    });

    vi.mocked(generateObject).mockRejectedValue(new Error('Something went wrong'));

    await expect(main()).rejects.toThrowError('Something went wrong');
  });

  it('checks the LLM output schema', async () => {
    const wordQueueContent = "Hello\n";

    vi.mocked(readFileSync).mockImplementation((path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      return '';
    });

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('_reedsy.dic')) {
        return "0\n";
      }
      return "";
    });

    vi.mocked(generateObject).mockResolvedValue({
      object: [{foo: 'bar'}],
    } as Awaited<ReturnType<typeof generateObject>>);

    await expect(main()).rejects.toThrowError('LLM output did not match required JSON schema');
  });

  it('sorts dictionary words alphabetically and adds word count', async () => {
    const llmOutput = [
      {
        word: 'Zebra',
        transformedWord: 'zebra',
        dictionaries: [
          {dictionary: 'en/en_US', score: 1},
        ]
      },
      {
        word: 'Apple',
        transformedWord: 'apple',
        dictionaries: [
          {dictionary: 'en/en_US', score: 1},
        ]
      },
      {
        word: 'Monkey',
        transformedWord: 'monkey',
        dictionaries: [
          {dictionary: 'en/en_US', score: 1},
        ]
      }
    ];

    const wordQueueContent = "Zebra\nApple\nMonkey\n";
    const existingDictContent = "2\ndog\ncat\n";

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      if (path.toString().endsWith('_reedsy.dic')) {
        return existingDictContent;
      }
      return "";
    });

    vi.mocked(generateObject).mockResolvedValue({
      object: llmOutput
    } as Awaited<ReturnType<typeof generateObject>>);

    await main();

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('en_US_reedsy.dic'),
      "5\napple\ncat\ndog\nmonkey\nzebra\n",
      "utf8"
    );
  });

  it('deduplicates words already in dictionary', async () => {
    const llmOutput = [
      {
        word: 'Hello',
        transformedWord: 'hello',
        dictionaries: [
          {dictionary: 'en/en_US', score: 1},
        ]
      }
    ];

    const wordQueueContent = "Hello\n";
    const existingDictContent = "3\napple\nhello\nzebra\n";

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      if (path.toString().endsWith('_reedsy.dic')) {
        return existingDictContent;
      }
      return "";
    });

    vi.mocked(generateObject).mockResolvedValue({
      object: llmOutput
    } as Awaited<ReturnType<typeof generateObject>>);

    await main();

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('en_US_reedsy.dic'),
      "3\napple\nhello\nzebra\n",
      "utf8"
    );
  });

  it('chunks a long word queue', async () => {
    const wordQueueContent =
      "time\nyear\npeople\nway\nday\nman\nthing\nwoman\nlife\nchild\nworld\nschool\nstate\nfamily\nstudent\ngroup\ncountry\nproblem\nhand\npart\nplace\ncase\nweek\ncompany\nsystem\nprogram\nquestion\nwork\ngovernment\nnumber\nnight\npoint\nhome\nwater\nroom\nmother\narea\nmoney\nstory\nfact\nmonth\nlot\nright\nstudy\nbook\neye\njob\nword\nbusiness\nissue\nside\nkind\nhead\nhouse\nservice\nfriend\nfather\npower\nhour\ngame\nline\nend\nmember\nlaw\ncar\ncity\ncommunity\nname\npresident\nteam\nminute\nidea\nkid\nbody\ninformation\nback\nparent\nface\nothers\nlevel\noffice\ndoor\nhealth\nperson\nart\nwar\nhistory\nparty\nresult\nchange\nmorning\nreason\nresearch\ngirl\nguy\nmoment\ngym\nhome\nfriendly\narchive\ncode\nchimney"; // 102 words

    vi.mocked(readFileSync).mockImplementation((path) => {
      if (path.toString().endsWith('word-queue.txt')) {
        return wordQueueContent;
      }
      return '';
    });

    vi.mocked(readFile).mockImplementation(async (path) => {
      if (path.toString().endsWith('_reedsy.dic')) {
        return "0\n";
      }
      return '';
    });

    vi.mocked(generateObject).mockResolvedValue({
      object: [],
    } as Awaited<ReturnType<typeof generateObject>>);

    await main();

    const words = wordQueueContent.split("\n").slice(0, 100);
    words.forEach(word => {
      expect(generateObject).toBeCalledWith(
        expect.objectContaining({prompt: expect.stringContaining(word)})
      );
    });
  });
});
