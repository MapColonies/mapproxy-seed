#!/usr/bin/env node
import { cliBuilder } from './cliBuilder';

try {
  void cliBuilder();
} catch (error) {
  console.log(error);
}

console.log('index.ts')
