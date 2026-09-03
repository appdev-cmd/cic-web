/** JSON shape used by generated Supabase contracts. */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Marker for the generated Supabase contract.
 * No table is invented here: generation must come from the authoritative linked project/schema.
 * Until that approved workflow runs, clients remain unparameterized and each feature owns explicit
 * persistence-row types next to its mapper. UI code must never import this file.
 */
export type DatabaseContractStatus = 'generation-required';
