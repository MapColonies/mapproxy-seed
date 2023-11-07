import config from 'config';
import { $ } from 'zx';
import { createGeojsonTxtFile, createSeedYaml } from './yaml/seedYaml';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SeedOptions = { cache: string, fromZoomLevel: number, toZoomLevel: number, wktFilePath: string };

export const executeSeed = async (options: SeedOptions): Promise<void> => {
  // create the seed.yaml file
  await createSeedYaml(options);

  const mapproxyYamlFilePath = config.get<string>('script.mapproxyYamlFilePath');
  const seedYamlFilePath = config.get<string>('script.seedYamlFilePath');

  await $`mapproxy-seed -f ${mapproxyYamlFilePath} -s ${seedYamlFilePath} --seed ${options.cache}`;
}
