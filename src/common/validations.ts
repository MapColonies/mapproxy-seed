import fs, { readFileSync } from 'fs';
import { load } from 'js-yaml';
import moment from 'moment';

enum CacheType {
  S3 = 's3',
  REDIS = 'redis',
  GPKG = 'geopackage',
}

type MapproxyCache = Record<'caches', Record<string, Record<'cache', Record<'type', string>>>>;

const throwError = (message: string): void => {
  throw new Error(`Error: ${message}`);
};

export const zoomComparison = (fromZoom: number, toZoom: number): boolean | void => {
  const valid = fromZoom <= toZoom;
  return valid ? true : throwError(`from zoom level value cannot be bigger than to zoom level value`);
};

export const fileExists = (filePath: string): boolean | void => {
  const exists = fs.existsSync(filePath);
  return exists ? true : throwError(`file '${filePath}' is not exists`);
};

export const isValidDateFormat = (dateString: string): boolean | void => {
  const validDateStringFormat = "yyyy-MM-dd'T'HH:mm:ss";
  const isValidDateFormat = moment(dateString, moment.ISO_8601, true).isValid();
  return isValidDateFormat ? true : throwError(`Date string must be 'ISO_8601' format: ${validDateStringFormat}, for exmaple: 2023-11-07T12:35:00`);
};

export const validateSupportedCache = (mapproxyYamlFilePath: string, cache: string): void => {
  const mapproxyYamlContent = readFileSync(mapproxyYamlFilePath, { encoding: 'utf8' });
  const mapproxyCache = load(mapproxyYamlContent) as MapproxyCache;

  const cacheType = mapproxyCache.caches[cache].cache.type;
  if (cacheType !== CacheType.REDIS) {
    throw new Error(
      `Invalid cache: ${cache}, seed operation can only run on '${CacheType.REDIS}' cache type, please check again your '--cache' input!`
    );
  }
};
