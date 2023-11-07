import argv from 'yargs/yargs';
import { SeedOptions, executeSeed } from './seed';
import { fileExists, zoomComparison } from './common/validations';

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
    'file': {
        describe: 'wkt file path',
        type: 'string',
        demandOption: true,
    }
}).check(argv => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return fileExists(argv.file) && zoomComparison(argv.fromzoom, argv.tozoom);
}).command('seed', 'seed mapproxy cache', async (argv) => {
    const args = await argv.argv;
    const options: SeedOptions = {
        cache: args.cache,
        fromZoomLevel: args.fromzoom,
        toZoomLevel: args.tozoom,
        wktFilePath: args.file,
    }
    await executeSeed(options);
}).help(true).strictCommands().demandCommand().argv;