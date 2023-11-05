#!/usr/bin/env node
import { executeSeed } from './seed';
import { createSeedYaml } from './yaml/seedYaml';
import minimist from 'minimist';
import yargs from 'yargs';
import argv from 'yargs/yargs';

export interface SeedArguments {
  seed: string;
  fromZoomLevel: number;
  toZoomLevel: number;
  wktFilePath: string;
}

try {
  const args = argv(process.argv.slice(2))
    .command('seed', 'seed mapproxy cache').options({
      'c': {
        alias: 'cache',
        describe: 'name of the mapproxy cached layer',
        type: 'string',
        demandOption: true
      },
      'minz': {
        alias: 'minzoom',
        describe: 'seed starts from this zoom level',
        type: 'number',
        demandOption: true
      },
      'maxz': {
        alias: 'maxzoom',
        describe: 'seed ends at this zoom level',
        type: 'number',
        demandOption: true
      },
      'f': {
        alias: 'file',
        describe: 'wkt file path',
        type: 'string',
        demandOption: true
      },
    }).help(true).strictCommands().demandCommand().argv;
  const cache = avi.c || avi.cache;
  const minZoom = argv.minz || argv.minzoom;
  const maxZoom = argv.maxz || argv.maxzoom;
  const wktFilePath = argv.f || argv.file;

  console.log('user command')
  void executeSeed(cache, minZoom, maxZoom, wktFilePath);
  //const args = parseArgs(process.argv);
  // console.log("ARGS:", args)
  // if (!args['seed']) {
  //   console.log("HEREEEEEEEEEEEEEE")
  //   throw new Error('Must specify --seed <LayerName> or --cleanup <LayerName> task flag')
  // }
  // void executeSeed('bluemarble', 1, 5, '/path');
} catch (error) {
  console.log(error);
}
//}

//avi().catch(console.error)
console.log('index.ts')
