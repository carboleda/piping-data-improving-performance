import module from 'node:module';
const require = module.createRequire(import.meta.url);
const { split } = require('event-stream');
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { getProduct } from '../common';

export const exec = async () => {
  await pipeline(
    fs.createReadStream('data/recipes.csv'),
    split(),
    processLines,
    fs.createWriteStream('data/out.csv')
  );
};

async function* processLines(source) {
  let currentRecipe = '';
  let products = [];

  for await (const line of source) {
    if (!isRecipe(line)) {
      const product = await getProduct(line);
      products.push(product);

      continue;
    }

    if (products.length > 0) {
      yield* processRecipe(currentRecipe, products);
    }

    currentRecipe = line;
    products = [];
  }

  if (products.length > 0) {
    yield* processRecipe(currentRecipe, products);
  }
}

async function* processRecipe(currentRecipe, products) {
  let totalCalories = 0;
  const plainProducts = products.map(({ id, name, calories }) => {
    totalCalories += calories;
    return [id, name, calories].join(',');
  });

  yield `${currentRecipe},${totalCalories},\n`;
  yield `${plainProducts.join('\n')}\n`;
}
