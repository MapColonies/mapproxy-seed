/* eslint-disable @typescript-eslint/naming-convention */
import argv from 'yargs/yargs';
import { SeedOptions, executeSeed } from './seed';
import { fileExists, isValidDateFormat, zoomComparison } from './common/validations';

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const runCli = async (): Promise<Record<string, unknown>> =>
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  argv(process.argv.slice(2))
    .options({
      cache: {
        describe: 'name of the mapproxy cached layer',
        type: 'string',
        demandOption: true,
      },
      grid: {
        alias: 'g',
        describe: 'name of the requested grid',
        type: 'string',
        demandOption: true,
      },
      'from-zoom': {
        describe: 'seed starts from this zoom level',
        type: 'number',
        demandOption: true,
      },
      'to-zoom': {
        describe: 'seed ends at this zoom level',
        type: 'number',
        demandOption: true,
      },
      'refresh-before': {
        alias: 'rb',
        describe: 'supported absolute datetime format: "yyyy-MM-ddTHH:mm:ss", refresh tile before this datetime',
        type: 'string',
        demandOption: true,
      },
      'skip-uncached': {
        alias: 's',
        describe: 'skip uncached tiles, seeds or refresh only cached tiles, required - default to "true" if value is not given',
        type: 'boolean',
        demandOption: true,
      },
      'geojson-file': {
        describe: 'geojson file path',
        type: 'string',
        demandOption: true,
      },
      concurrency: {
        alias: 'c',
        describe: 'number of concurrent seed worker.',
        type: 'number',
        demandOption: true,
      },
    })
    .check((argv) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      return fileExists(argv['geojson-file']) && zoomComparison(argv['from-zoom'], argv['to-zoom']) && isValidDateFormat(argv['refresh-before']);
    })
    .command('seed', 'args', async (argv) => {
      const args = await argv.argv;
      const options: SeedOptions = {
        cache: args.cache,
        grid: args.grid,
        fromZoomLevel: args['from-zoom'],
        toZoomLevel: args['to-zoom'],
        refreshBefore: args['refresh-before'],
        wktFilePath: args['geojson-file'],
        skipUncached: args['skip-uncached'],
        concurrency: args['concurrency'],
      };
      await executeSeed(options);
    })
    .help(true)
    .strictCommands()
    .demandCommand().argv;
