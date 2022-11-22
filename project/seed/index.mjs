import module from 'node:module';
const require = module.createRequire(import.meta.url);
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
const { split } = require('event-stream');

const [targetSizeInGb = 2] = process.argv.slice(2);
const GB_IN_BYTES = 1024 ** 3;

async function* extractIds(source) {
  let first = true;
  for await (const chunk of source) {
    if (first) {
      first = false;
      console.log('Extracting ids...');
    }

    const [, , id] = chunk.toString().split(',');
    if (!id || isNaN(id)) {
      continue;
    }

    yield id + '\n';
  }
}

function getCreateRecipes() {
  console.log('Creating recipes...');
  let lineCount = 0;

  return async function* (source) {
    for await (const chunk of source) {
      if (lineCount % 10 === 0) {
        yield `=== Recipe ${lineCount / 10 + 1} ===\n`;
      }
      yield chunk.toString() + '\n';
      lineCount++;
    }
  };
}

async function createIdsFile() {
  await pipeline(
    createReadStream('data/products.csv'),
    split(),
    extractIds,
    createWriteStream('data/ids.csv')
  );
}

async function createBigFile() {
  const fileSize = (await stat('data/ids.csv')).size;
  const iterations = Math.ceil(
    (targetSizeInGb * GB_IN_BYTES) / (fileSize * 1.2)
  );
  console.log(`Creating ${targetSizeInGb}Gb file...`);
  const createRecipes = getCreateRecipes();

  for (let i = 0; i < iterations; i++) {
    await pipeline(
      createReadStream('data/ids.csv'),
      split(),
      createRecipes,
      createWriteStream('data/recipes.csv', { flags: 'a' })
    );
  }
}

(async () => {
  await unlink('data/recipes.csv').catch(() =>
    console.warn('There is not previous file to delete')
  );
  await createIdsFile();
  await createBigFile();
  await unlink('data/ids.csv');
  console.log('Done!');
})();
