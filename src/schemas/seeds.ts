/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

interface SeedLevels {
  from: number;
  to: number;
}

const validZoomLevels = (levels: SeedLevels): boolean => {
  return levels.from <= levels.to;
};

const refreshBeforeSchema = {
  time: z.string(),
};

const levelsSchema = {
  from: z.number().min(0).max(23),
  to: z.number(),
};

const seedTitleSchema = z.string();

const invalidZoomLevelsMessage = 'levels.from value can not bigger than levels.to';
const seedContentSchema = z.object({
  caches: z.array(z.string()),
  coverages: z.array(z.string()),
  refresh_before: z.object(refreshBeforeSchema),
  levels: z.object(levelsSchema).refine(validZoomLevels, { message: invalidZoomLevelsMessage }),
});

const seedRecord = z.record(seedTitleSchema, seedContentSchema);

export const seedsSchema = z.object({ seeds: seedRecord });
export type Seed = z.infer<typeof seedsSchema>;
