import fs from 'node:fs/promises';
import { getProduct, isRecipe } from '../common';

export const exec = async () => {
  const content = await fs.readFile('data/recipes.csv', 'utf8');
  const lines = content.split('\n');

  await processLines(lines);
};

async function processLines(lines) {
  let currentRecipe = '';
  let products = [];

  for await (const line of lines) {
    if (!isRecipe(line)) {
      const product = await getProduct(line);
      products.push(product);

      continue;
    }

    if (products.length > 0) {
      await processRecipe(currentRecipe, products);
    }

    currentRecipe = line;
    products = [];
  }

  if (products.length > 0) {
    await processRecipe(currentRecipe, products);
  }
}

async function processRecipe(currentRecipe, products) {
  let totalCalories = 0;
  const plainProducts = products.map(({ id, name, calories }) => {
    totalCalories += calories;
    return [id, name, calories].join(',');
  });

  const recipe = `${currentRecipe},${totalCalories},
  ${plainProducts.join('\n')}\n`;

  fs.writeFile('data/out.csv', recipe, {
    flag: 'a',
  });
}
