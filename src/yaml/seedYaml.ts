/* eslint-disable @typescript-eslint/naming-convention */
import { promises as fsp } from 'fs';
import { dump } from 'js-yaml';
import { Seed, seedsSchema } from '../schema/seeds.js';
import { Coverage, coveragesSchema } from '../schema/coverages.js';

export const createSeedYaml = async (layerName: string, fromZoomLevel: number, toZoomLevel: number, wktFilePath: string): Promise<void> => {
  try {
    const coverageName = `${layerName}-coverage`
    const seed: Seed = {
      seeds: {
        [layerName]: {
          caches: [layerName],
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
    }

    const coverage: Coverage = {
      coverages: {
        [coverageName]: {
          datasource: wktFilePath,
          srs: 'EPSG:4326'
        }
      }
    }
    
    const jsonSeeds = seedsSchema.parse(seed);
    const jsonCoverages = coveragesSchema.parse(coverage);
    const jsonFullContent = Object.assign(jsonSeeds, jsonCoverages);
    const yamlSeed = dump(jsonFullContent, { noArrayIndent: true });
    await fsp.writeFile('/media/shlomiko/data/mapproxy/mapproxy/test-seed.yaml', yamlSeed);
  } catch (err) {
    console.log(err);
  }
};
