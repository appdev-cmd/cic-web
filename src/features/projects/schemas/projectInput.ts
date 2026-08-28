import { z } from 'zod';

/** Write contract mirrors cic_projects constraints; UI-only fields are excluded. */
export const projectInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  alias: z.string().trim().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  tagline: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  sector: z.string().max(150).nullable().optional(),
  solution: z.string().max(255).nullable().optional(),
  technologies: z.array(z.string().trim().min(1)).default([]),
  customer_name: z.string().max(255).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  start_year: z.number().int().min(1).max(9999).nullable().optional(),
  end_year: z.number().int().min(1).max(9999).nullable().optional(),
  is_ongoing: z.boolean().default(false),
  image: z.string().max(500).nullable().optional(),
  is_featured: z.boolean().default(false),
  published: z.boolean().default(false),
  ordering: z.number().int().min(0).default(0),
}).refine((value) => value.end_year == null || value.start_year == null || value.end_year >= value.start_year, { path: ['end_year'], message: 'end_year must be greater than or equal to start_year' })
  .refine((value) => !value.is_ongoing || value.end_year == null, { path: ['end_year'], message: 'Ongoing projects cannot have an end_year' });

export type ProjectInput = z.infer<typeof projectInputSchema>;
