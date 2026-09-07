import { config } from 'dotenv';
import postgres from 'postgres';

config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql=postgres(process.env.DATABASE_URL,{max:1,prepare:false,ssl:'require'});
try{
  const [result]=await sql`
    SELECT
      (SELECT count(*)::int FROM public.cic_users) AS users,
      (SELECT count(*)::int FROM public.cic_users WHERE auth_user_id IS NOT NULL) AS mapped_auth_users,
      (SELECT count(*)::int FROM public.cic_users WHERE account_status='active') AS active_users,
      (SELECT count(*)::int FROM public.cic_user_roles WHERE status='active') AS active_assignments,
      NOT EXISTS (SELECT 1 FROM public.cic_users WHERE account_status NOT IN ('active','suspended','deactivated','pending_invite')) AS statuses_valid,
      NOT EXISTS (SELECT lower(trim(email)) FROM public.cic_users WHERE email IS NOT NULL AND trim(email) <> '' GROUP BY lower(trim(email)) HAVING count(*)>1) AS emails_unique,
      NOT EXISTS (SELECT lower(trim(username)) FROM public.cic_users WHERE username IS NOT NULL AND trim(username) <> '' GROUP BY lower(trim(username)) HAVING count(*)>1) AS usernames_unique,
      NOT EXISTS (SELECT 1 FROM information_schema.role_table_grants WHERE table_schema='public' AND table_name IN ('cic_users','cic_user_roles','cic_user_status_history','cic_security_events') AND grantee IN ('anon','authenticated') AND privilege_type IN ('INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER')) AS browser_writes_revoked,
      (SELECT count(*)::int FROM pg_class WHERE relnamespace='public'::regnamespace AND relname IN ('cic_users','cic_user_roles','cic_user_status_history','cic_security_events') AND relrowsecurity) AS rls_tables
  `;
  const required=['statuses_valid','emails_unique','usernames_unique','browser_writes_revoked'];
  if(required.some((key)=>result[key]!==true)||Number(result.rls_tables)!==4)throw new Error(`Users identity verification failed: ${JSON.stringify(result)}`);
  console.log(JSON.stringify(result,null,2));
}finally{await sql.end({timeout:2});}
