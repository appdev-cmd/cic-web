import { z } from 'zod';
export const functionSeoInputSchema = z.object({ id: z.string().min(1), locale: z.enum(['vi','en']), title: z.string().max(255), keywords: z.string().max(1000), description: z.string().max(5000), indexable: z.boolean() });
export type FunctionSeoInput = z.infer<typeof functionSeoInputSchema>;
