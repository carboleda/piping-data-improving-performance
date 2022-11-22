import axios from 'axios';

export const SolutionType = {
  Buffer: 'buffer',
  Stream: 'stream',
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
