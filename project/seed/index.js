const fs = require('node:fs');
const fsp = require('node:fs/promises');
const { pipeline } = require('node:stream/promises');
const es = require('event-stream');

const [SIZE_IN_GB = 2] = process.argv.slice(2);
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

async function* createRecipes(source) {
  let lineCount = 0;
  let first = true;

  for await (const chunk of source) {
    if (first) {
      first = false;
      console.log('Creating recipes...');
    }

    if (lineCount % 10 === 0) {
      yield `=== Recipe ${(lineCount / 10) + 1} ===\n`;
    }
    yield chunk.toString();
    lineCount++
  }
}

async function extractIdsAndCreateRecipes() {
  await pipeline(
    fs.createReadStream('data/products.csv'),
    es.split(),
    extractIds,
    createRecipes,
    fs.createWriteStream('data/ids.csv')
  );
}

async function createBigFile() {
  console.log('Creating big file...');
  const fileSize = (await fsp.stat('data/ids.csv')).size;
  const iterations = Math.ceil((SIZE_IN_GB * GB_IN_BYTES) / fileSize);

  for (let i = 0; i < iterations; i++) {
    await pipeline(
      fs.createReadStream('data/ids.csv'),
      fs.createWriteStream('data/recipes.csv', { flags: 'a' })
    );
  }
}

(async () => {
  await fsp.unlink('data/recipes.csv')
    .catch(() => console.warn('There is not previous file to delete'));
  await extractIdsAndCreateRecipes();
  await createBigFile();
  await fsp.unlink('data/ids.csv');
  console.log('Done!');
})()
