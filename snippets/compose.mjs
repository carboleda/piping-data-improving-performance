import { compose, finished, Transform } from 'node:stream';

// Convert AsyncIterable into readable Duplex.
const s1 = (async function* () {
  yield 'Hello';
  yield 'World';
})();
const s2 = (async function* (source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
})();
const s3 = async function (source) {
  for await (const chunk of source) {
    res += chunk;
  }
};

console.log(s1, s2, s3);

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

finished(compose(process.stdin, upperCase, process.stdout), (error) =>
  console.error(error, res)
);

// $ node compose.js
// Hello gdg Cali
// HELLO GDG CALI
