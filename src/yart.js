#!/usr/bin/env node

const { main } = require('./main');

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err.message);
  process.exitCode = 1;
});
