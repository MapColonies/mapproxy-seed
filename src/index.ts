import 'reflect-metadata';
import {wktSeed} from './yaml/schema';

try {
  void wktSeed('bluemarble', 0, 5, '/');
  
} catch (error) {
  console.log(error);
}
console.log('index.ts')
