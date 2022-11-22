import { pipeline, Transform } from 'node:stream';

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

pipeline(process.stdin, upperCase, process.stdout, (error) =>
  console.error(error)
);

// $ node pipeline.js
// Hello gdg Cali
// HELLO GDG CALI
