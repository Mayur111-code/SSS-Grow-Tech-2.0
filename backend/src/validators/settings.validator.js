import { z } from 'zod';

const settingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.any(),
    })
  ),
});

export { settingsSchema };
export default { settingsSchema };
