#!/usr/bin/env node
import { runCli } from './cliBuilder';

try {
  void runCli();
} catch (error) {
  console.log(error);
}
