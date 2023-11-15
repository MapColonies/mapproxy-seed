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
  const mapproxyYamlFilePath = process.env.MAPPROXY_YAML_FILE_PATH ?? '/mapproxy/mapproxy.yaml';
  const seedYamlFilePath = process.env.SEED_YAML_FILE_PATH ?? '/mapproxy/seed.yaml';
  const flags: string[] = [];

  console.log('validating supported cache.');
  validateSupportedCache(mapproxyYamlFilePath, options.cache);
  console.log(`creating seed yaml file on path: ${seedYamlFilePath}.`);
  await createSeedYamlFile(options, seedYamlFilePath);

  if (options.skipUncached) {
    console.log('requested to skip uncached tiles.');
    flags.push('--skip-uncached');
  }

  console.log(`running seed commad.`);
  await $`mapproxy-seed -f ${mapproxyYamlFilePath} -s ${seedYamlFilePath} --seed ${options.cache} --concurrency ${options.concurrency} ${flags}`;
};
