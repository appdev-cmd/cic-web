import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import postgres from 'postgres';
const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1,prepare:false});
try{await sql.unsafe(await readFile('db_migrate/migrations/20260904_product_categories_hardening.sql','utf8'));console.log('Product categories hardening applied.');}finally{await sql.end();}
