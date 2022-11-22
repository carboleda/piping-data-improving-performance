import { Transform } from 'node:stream';

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

process.stdin.pipe(upperCase).pipe(process.stdout);

// $ node pipe.js
// Hello gdg Cali
// HELLO GDG CALI
