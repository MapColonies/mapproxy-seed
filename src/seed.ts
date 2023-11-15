import config from 'config';
import { $ } from 'zx';
import { createSeedYamlFile } from './yaml/creator';
import { validateSupportedCache } from './common/validations';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SeedOptions = {
  cache: string;
  grid: string;
  fromZoomLevel: number;
  toZoomLevel: number;
  refreshBefore: string;
  wktFilePath: string;
  skipUncached: boolean;
  concurrency: number;
};

export const executeSeed = async (options: SeedOptions): Promise<void> => {
  const mapproxyYamlFilePath = config.get<string>('mapproxyYamlFilePath');
  const seedYamlFilePath = config.get<string>('seedYamlFilePath');
  const flags: string[] = [];

  validateSupportedCache(mapproxyYamlFilePath, options.cache);
  await createSeedYamlFile(options);

  if (options.skipUncached) {
    flags.push('--skip-uncached');
  }

  await $`mapproxy-seed -f ${mapproxyYamlFilePath} -s ${seedYamlFilePath} --seed ${options.cache} --concurrency ${options.concurrency} ${flags}`;
};
