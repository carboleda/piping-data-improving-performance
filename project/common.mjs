import fs from 'node:fs/promises';
import axios from 'axios';
import { SingleBar, Presets } from 'cli-progress';

export const SolutionType = {
  Buffer: 'buffer',
  Stream: 'stream',
};

export const FileName = {
  Seed: 'data/products.csv',
  Ids: 'data.ids.csv',
  Input: 'data/recipes.csv',
  Output: 'data/out.csv',
};

export async function getProduct(id) {
  const response = await axios.get(
    `https://www.gtinsearch.org/api/items/${id}`
  );
  const { name, calories } = response.data[0] || {};
  return { id, name, calories: parseFloat(calories || '0') };
}

export function isRecipe(line) {
  return line.startsWith('=');
}

export async function createProgressBar() {
  const totalBytes = (await fs.stat(FileName.Input)).size;
  const bar = new SingleBar(
    {
      format:
        'Progress | {bar} | {percentage}% | {duration_formatted} | {value}/{total} Bytes',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      stopOnComplete: true,
    },
    Presets.shades_classic
  );
  bar.start(totalBytes, 0);

  return {
    update: (readBytes) => {
      bar.increment(readBytes);
    },
  };
}
