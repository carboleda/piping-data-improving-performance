// 1. Read file
// 2. Split recipes
// 3. Get productos from API
// 4. Create new csv with:
//    === Recipe # ===, Total calories
//    Product id, Product name, Calories

import fs from 'node:fs/promises';
import { createProgressBar, FileName, SolutionType } from '../common.mjs';
import * as buffer from './buffer/index.mjs';
import * as stream from './stream/index.mjs';

(async () => {
  const [type = SolutionType.Buffer] = process.argv.slice(2);
  const solution = getSolution(type);
  const progressBar = await createProgressBar();

  console.time('Run');
  await deleteOutFile();
  solution.events.on('read', progressBar.update);
  await solution.exec();
  console.timeEnd('Run');

  const memory = Math.ceil(process.memoryUsage().rss / 1024 ** 2);
  console.log(`Memory used: ${memory} MB`);
})();

function getSolution(type) {
  if (type === SolutionType.Buffer) {
    return buffer;
  }

  if (type === SolutionType.Stream) {
    return stream;
  }

  throw new Error('Invalid type');
}

async function deleteOutFile() {
  try {
    await fs.unlink(FileName.Output);
  } catch (error) {}
}
