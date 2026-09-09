import fs from 'node:fs/promises';
import postgres from 'postgres';
const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1,prepare:false});
try{const migration=await fs.readFile(new URL('../db_migrate/migrations/20260908_product_applications_hardening.sql',import.meta.url),'utf8');await sql.unsafe(migration);console.log('Product applications hardening applied.');}finally{await sql.end();}
