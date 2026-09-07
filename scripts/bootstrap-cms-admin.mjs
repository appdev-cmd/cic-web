import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';

// Explicit process environment values (for example one-off password rotation)
// must take precedence over defaults loaded from the local env file.
config({ path: '.env.local', override: false, quiet: true });
const required=['NEXT_PUBLIC_SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','DATABASE_URL','CMS_BOOTSTRAP_ADMIN_PASSWORD'];
for(const key of required) if(!process.env[key]) throw new Error(`${key} is required for CMS admin bootstrap.`);
const email=(process.env.CMS_BOOTSTRAP_ADMIN_EMAIL || 'admin@cic.com.vn').trim().toLowerCase();
const password=process.env.CMS_BOOTSTRAP_ADMIN_PASSWORD;
if(password.length<16) throw new Error('CMS_BOOTSTRAP_ADMIN_PASSWORD must contain at least 16 characters.');
const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}}).auth.admin;
const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1});
try {
  const [profile]=await sql`SELECT id,email FROM cic_users WHERE lower(email)=${email} AND account_status='active' AND published IS DISTINCT FROM false LIMIT 1`;
  if(!profile) throw new Error(`No active cic_users profile exists for ${email}.`);
  let authUser; let page=1;
  while(!authUser){const {data,error}=await admin.listUsers({page,perPage:100});if(error)throw error;authUser=data.users.find((user)=>user.email?.toLowerCase()===email);if(authUser||data.users.length<100)break;page+=1;}
  if(!authUser){const {data,error}=await admin.createUser({email,password,email_confirm:true,user_metadata:{cms_profile_id:profile.id}});if(error)throw error;authUser=data.user;}
  else if(process.env.CMS_BOOTSTRAP_ADMIN_ROTATE_PASSWORD==='true'){const {data,error}=await admin.updateUserById(authUser.id,{password,email_confirm:true,user_metadata:{...authUser.user_metadata,cms_profile_id:profile.id}});if(error)throw error;authUser=data.user;}
  const [identityConflict]=await sql`SELECT id FROM cic_users WHERE auth_user_id=${authUser.id}::uuid AND id<>${profile.id} LIMIT 1`;
  if(identityConflict) throw new Error('The Supabase Auth identity is already linked to another CMS profile.');
  const [linkedProfile]=await sql`UPDATE cic_users SET auth_user_id=${authUser.id}::uuid WHERE id=${profile.id} AND (auth_user_id IS NULL OR auth_user_id=${authUser.id}::uuid) RETURNING id`;
  if(!linkedProfile) throw new Error('The CMS profile is already linked to another Supabase Auth identity.');
  const [role]=await sql`SELECT id FROM cic_roles WHERE lower(code)='superadmin' AND status='active' LIMIT 1`;
  if(!role) throw new Error('Run npm run db:apply-audit-foundation before admin bootstrap.');
  await sql`INSERT INTO cic_user_roles (user_id,role_id,status) SELECT ${profile.id},${role.id},'active' WHERE NOT EXISTS (SELECT 1 FROM cic_user_roles WHERE user_id=${profile.id} AND role_id=${role.id} AND status='active')`;
  console.log(JSON.stringify({authUserId:authUser.id,email,profileId:profile.id,role:'superadmin',createdOrLinked:true},null,2));
} finally { await sql.end({timeout:2}); }
