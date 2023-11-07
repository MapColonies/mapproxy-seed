import argv from 'yargs/yargs';
import { SeedOptions, executeSeed } from './seed';
import { fileExists, isValidDateFormat, zoomComparison } from './common/validations';

export const cliBuilder = async () => argv(process.argv.slice(2)).options({
    'cache': {
        describe: 'name of the mapproxy cached layer',
        type: 'string',
        demandOption: true
    },
    'fromzoom': {
        describe: 'seed starts from this zoom level',
        type: 'number',
        demandOption: true
    },
    'tozoom': {
        describe: 'seed ends at this zoom level',
        type: 'number',
        demandOption: true
    },
    'refreshbefore': {
        alias: 'rb',
        describe: 'supported absolute datetime format: "yyyy-MM-ddTHH:mm:ss", refresh tile before this datetime',
        type: 'string',
        demandOption: true,
    },
    'skipuncached': {
        alias: 's',
        describe: 'skip uncached tiles, seeds or refresh only cached tiles',
        type: 'boolean',
        demandOption: true,  
    },
    'file': {
        describe: 'wkt file path',
        type: 'string',
        demandOption: true,
    }
}).check(argv => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return fileExists(argv.file) && zoomComparison(argv.fromzoom, argv.tozoom) && isValidDateFormat(argv.refreshbefore);
}).command('seed', 'seed mapproxy cache', async (argv) => {
    const args = await argv.argv;
    const options: SeedOptions = {
        cache: args.cache,
        fromZoomLevel: args.fromzoom,
        toZoomLevel: args.tozoom,
        refreshBefore: args.refreshbefore,
        wktFilePath: args.file,
        skipUncached: args.skipuncached
    }
    await executeSeed(options);
}).help(true).strictCommands().demandCommand().argv;