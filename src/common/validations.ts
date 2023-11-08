import fs from 'fs';
import moment from 'moment';

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
