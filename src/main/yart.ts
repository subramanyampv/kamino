#!/usr/bin/env node

import { main } from './main';

main().catch(err => {
  console.log(err.message);
  process.exitCode = 1;
});
