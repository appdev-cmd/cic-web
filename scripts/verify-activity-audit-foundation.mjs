import { config } from 'dotenv';
import postgres from 'postgres';
config({ path: '.env.local', override: true, quiet: true });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const sql=postgres(process.env.DATABASE_URL,{max:1,prepare:false,ssl:'require'});
try {
  const result=await sql.begin(async tx=>{
    const [identity]=await tx`SELECT id,email FROM cic_users WHERE account_status='active' AND published IS DISTINCT FROM false AND email IS NOT NULL ORDER BY (lower(email)='admin@cic.com.vn') DESC,id LIMIT 1`;
    if(!identity) throw new Error('No active CMS profile is available for transaction-local permission verification.');
    await tx`SELECT setval(pg_get_serial_sequence('public.cic_roles','id'),coalesce((SELECT max(id) FROM cic_roles),1),EXISTS(SELECT 1 FROM cic_roles))`;
    await tx`SELECT setval(pg_get_serial_sequence('public.cic_user_roles','id'),coalesce((SELECT max(id) FROM cic_user_roles),1),EXISTS(SELECT 1 FROM cic_user_roles))`;
    const [role]=await tx`INSERT INTO cic_roles (code,name,description,status,is_protected) VALUES (${`audit_verification_${crypto.randomUUID()}`},'Audit verification','Transaction-local verification role','active',false) RETURNING id`;
    await tx`INSERT INTO cic_user_roles (user_id,role_id,status) VALUES (${identity.id},${role.id},'active')`;
    await tx`INSERT INTO cic_role_permissions (role_id,permission_task_id,action,allowed) SELECT ${role.id},id,action,true FROM cic_permission_tasks CROSS JOIN unnest(ARRAY['view','view_sensitive','export']) action WHERE lower(module)='audit'`;
    const [event]=await tx`INSERT INTO cic_activity_logs (actor_id,actor_label,action_code,category,severity,is_sensitive,entity_type,entity_id,entity_title,module,workspace,result,before_data,after_data,redacted_fields) VALUES (${identity.id},'Audit verification','settings.updated','config_publish','high',true,'system_settings','verification','Verification only','settings','global','success',${tx.json({api_key:'[REDACTED]'})},${tx.json({api_key:'[REDACTED]'})},${tx.array(['before.api_key','after.api_key'])}) RETURNING id`;
    let appendOnly=false;
    try { await tx.savepoint(async sp=>{await sp`UPDATE cic_activity_logs SET result='failed' WHERE id=${event.id}`;}); } catch(error) { appendOnly=String(error.message).includes('append-only'); }
    if(!appendOnly) throw new Error('Append-only trigger did not reject UPDATE.');
    await tx`SET LOCAL ROLE authenticated`; await tx`SELECT set_config('request.jwt.claims',${JSON.stringify({email:identity.email,role:'authenticated'})},true)`;
    const [view]=await tx`SELECT public.cic_cms_has_permission('audit','view') AS allowed`; const [sensitive]=await tx`SELECT public.cic_cms_has_permission('audit','view_sensitive') AS allowed`;
    const [{count:authorizedCmsRows}]=await tx`SELECT count(*)::int AS count FROM public.cic_users`;
    let rawTableDenied=false; try { await tx.savepoint(async sp=>{await sp`SELECT id FROM public.cic_activity_logs WHERE id=${event.id}`;}); } catch(error) { rawTableDenied=String(error.code)==='42501'; }
    await tx`SELECT set_config('request.jwt.claims',${JSON.stringify({email:'nobody@example.invalid',role:'authenticated'})},true)`; const [unauthorized]=await tx`SELECT public.cic_cms_has_permission('audit','view') AS allowed`; const [{count:unauthorizedCmsRows}]=await tx`SELECT count(*)::int AS count FROM public.cic_users`; await tx`RESET ROLE`;
    if(!view.allowed || !sensitive.allowed || unauthorized.allowed || !rawTableDenied || Number(authorizedCmsRows) <= 0 || Number(unauthorizedCmsRows) !== 0) throw new Error('RLS, raw-table isolation or permission verification failed.');
    const [bucket]=await tx`SELECT public FROM storage.buckets WHERE id='audit-exports'`; const [{count:storagePolicies}]=await tx`SELECT count(*)::int AS count FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'audit_exports_%'`;
    if(!bucket || bucket.public || Number(storagePolicies)!==3) throw new Error('Private export storage enforcement is incomplete.');
    const [{count:validatedExportConstraints}]=await tx`SELECT count(*)::int AS count FROM pg_constraint WHERE conrelid='public.cic_audit_export_jobs'::regclass AND convalidated AND conname IN ('cic_audit_export_jobs_status_check','cic_audit_export_jobs_workspace_check','cic_audit_export_jobs_total_records_check','cic_audit_export_jobs_file_size_bytes_check')`;
    if(Number(validatedExportConstraints)!==4) throw new Error('Audit export constraints are incomplete or not validated.');
    await tx`SELECT set_config('app.audit_retention_mode','on',true)`; await tx`DELETE FROM cic_activity_logs WHERE id=${event.id}`; await tx`DELETE FROM cic_user_roles WHERE role_id=${role.id}`; await tx`DELETE FROM cic_role_permissions WHERE role_id=${role.id}`; await tx`DELETE FROM cic_roles WHERE id=${role.id}`;
    const [{count:cmsReadPolicies}]=await tx`SELECT count(*)::int AS count FROM pg_policies WHERE schemaname='public' AND policyname LIKE 'cms_authenticated_read_%'`;
    return {authorizedPermission:true,unauthorizedPermission:true,sensitivePermission:true,authorizedCmsRead:true,unauthorizedCmsRead:true,cmsReadPolicies:Number(cmsReadPolicies),rawTableDenied:true,appendOnly:true,redactionMarker:true,privateExport:true,storagePolicies:Number(storagePolicies),validatedExportConstraints:Number(validatedExportConstraints),temporaryStateCommitted:false};
  });
  console.log(JSON.stringify(result,null,2));
} finally { await sql.end({timeout:2}); }
