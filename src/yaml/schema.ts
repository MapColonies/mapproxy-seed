/* eslint-disable @typescript-eslint/naming-convention */
import { readFileSync, promises as fsp } from 'fs';
import { dump } from 'js-yaml';
import { BBox, Polygon } from '@turf/helpers';
import { Seed, seedsSchema } from '../schema/seeds';
import { Coverage, coveragesSchema } from '../schema/coverages';
import { json } from 'express';



export const wktSeed = async (layerName: string, fromZoomLevel: number, toZoomLevel: number, wktFilePath: string): Promise<void> => {
  try {
    const seed: Seed = {
      seeds: {
        [layerName]: {
          caches: [layerName],
          coverages: ['bluemarble-bbox'],
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
        [layerName]: {
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
    console.log(yamlSeed);
  } catch (err) {
    console.log(err);
  }
};
