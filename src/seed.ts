import { $ } from 'zx';
import { createSeedYaml } from './yaml/seedYaml';
import config from 'config';

export const executeSeed = async(layerName: string, fromZoomLevel: number, toZoomLevel: number, wktFilePath: string): Promise<void> => {
  // create the seed.yaml file
  createSeedYaml(layerName, fromZoomLevel, toZoomLevel, wktFilePath);
  
  const mapproxyYamlFilePath = config.get<string>('script.mapproxyYamlFilePath');
  const seedYamlFilePath = config.get<string>('script.seedYamlFilePath');
    
  await $`mapproxy-seed -f ${mapproxyYamlFilePath} -s ${seedYamlFilePath} --seed ${layerName}`;
}
