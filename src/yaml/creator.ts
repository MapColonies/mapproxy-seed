/* eslint-disable @typescript-eslint/naming-convention */
import { writeFileSync, promises as fsp } from 'fs';
import config from 'config';
import { dump } from 'js-yaml';
import { Seed, seedsSchema } from '../schemas/seeds.js';
import { Coverage, coveragesSchema } from '../schemas/coverages.js';
import { SeedOptions } from '../seed.js';

export const createGeojsonTxtFile = (path: string, data: string): void => {
  try {
    writeFileSync(path, data);
  } catch (error) {
    console.error(error);
  }
};

export const createSeedYamlFile = async ({ cache, grid, fromZoomLevel, toZoomLevel, refreshBefore, wktFilePath  }: SeedOptions): Promise<void> => {
  try {
    const seedYamlFilePath = config.get<string>('seedYamlFilePath');
    const coverageName = `${cache}-coverage`;

    const seed: Seed = {
      seeds: {
        [cache]: {
          caches: [cache],
          coverages: [coverageName],
          grids: [grid],
          levels: {
            from: fromZoomLevel,
            to: toZoomLevel,
          },
          refresh_before: {
            time: refreshBefore,
          },
        },
      },
    };

    const coverage: Coverage = {
      coverages: {
        [coverageName]: {
          datasource: wktFilePath,
          srs: 'EPSG:4326',
        },
      },
    };

    const jsonSeeds = seedsSchema.parse(seed);
    const jsonCoverages = coveragesSchema.parse(coverage);
    const jsonFullContent = Object.assign(jsonSeeds, jsonCoverages);

    const yamlSeed = dump(jsonFullContent, { noArrayIndent: true });
    await fsp.writeFile(seedYamlFilePath, yamlSeed);
  } catch (err) {
    console.log(err);
  }
};
