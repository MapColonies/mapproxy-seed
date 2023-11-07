/* eslint-disable @typescript-eslint/naming-convention */
import { writeFileSync, promises as fsp} from 'fs';
import { dump } from 'js-yaml';
import { Seed, seedsSchema } from '../schema/seeds.js';
import { Coverage, coveragesSchema } from '../schema/coverages.js';
import { SeedOptions } from '../seed.js';

export const createGeojsonTxtFile = (path: string, data: string): void => {
  try {
    writeFileSync(path, data);
  } catch (error) {
    console.error(error);
  }
}

export const createSeedYaml = async ({ cache, fromZoomLevel, toZoomLevel, wktFilePath }: SeedOptions): Promise<void> => {
  try {
    const coverageName = `${cache}-coverage`
    const seed: Seed = {
      seeds: {
        [cache]: {
          caches: [cache],
          coverages: [coverageName],
          levels: {
            from: fromZoomLevel,
            to: toZoomLevel
          },
          refresh_before: {
            hours: 1
          }
        }
      }
    };

    const coverage: Coverage = {
      coverages: {
        [coverageName]: {
          datasource: wktFilePath,
          srs: 'EPSG:4326'
        }
      }
    };

    const jsonSeeds = seedsSchema.parse(seed);
    const jsonCoverages = coveragesSchema.parse(coverage);
    const jsonFullContent = Object.assign(jsonSeeds, jsonCoverages);
    const yamlSeed = dump(jsonFullContent, { noArrayIndent: true });
    await fsp.writeFile('/mapproxy/test-seed.yaml', yamlSeed);
  } catch (err) {
    console.log(err);
  }
};
