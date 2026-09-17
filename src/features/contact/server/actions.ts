'use server';

import { contactInputSchema } from '../schemas/contactInput';
import { getDatabaseClient } from '@/server/db/foundation';
import { getPostgresClient } from '@/server/db/postgres';
import { customerInteractionInputSchema } from '../schemas/customerInteractionInput';

export async function submitContactAction(payload: unknown) {
  const input = contactInputSchema.parse(payload);
  const client = await getDatabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await client
    .from('cic_contact')
    .insert({
      ...input,
      edited_time: now,
      created_time: now,
      published: false,
    })
    .select('id,created_time')
    .single();

  if (error || !data) throw new Error('Unable to submit contact request.');

  // Initialize operational overlay in background / transaction
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, 'new', 'medium', '{}', now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) DO NOTHING
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ source: 'contact_form', subject: input.subject || 'Liên hệ mới' })}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitContactAction] Error initializing customer request state:', err);
  }

  return { ok: true };
}

export async function submitCustomerInteractionAction(payload: unknown) {
  const input = customerInteractionInputSchema.parse(payload);
  const values = input.values;
  const now = new Date().toISOString();
  const client = await getDatabaseClient();

  const email = typeof values.email === 'string' ? values.email.trim() : '';

  const fullname =
    typeof values.fullName === 'string' && values.fullName.trim()
      ? values.fullName.trim()
      : typeof values.fullname === 'string' && values.fullname.trim()
      ? values.fullname.trim()
      : typeof values.name === 'string' && values.name.trim()
      ? values.name.trim()
      : null;

  const telephone =
    typeof values.phone === 'string' && values.phone.trim()
      ? values.phone.trim()
      : typeof values.phoneNumber === 'string' && values.phoneNumber.trim()
      ? values.phoneNumber.trim()
      : typeof values.telephone === 'string' && values.telephone.trim()
      ? values.telephone.trim()
      : null;

  const subject =
    typeof values.subject === 'string' && values.subject.trim()
      ? values.subject.trim()
      : input.formName || 'Yêu cầu liên hệ';

  const message =
    typeof values.message === 'string' && values.message.trim()
      ? values.message.trim()
      : typeof values.note === 'string' && values.note.trim()
      ? values.note.trim()
      : typeof values.notes === 'string' && values.notes.trim()
      ? values.notes.trim()
      : null;

  const { data, error } = await client
    .from('cic_contact')
    .insert({
      email,
      fullname,
      telephone,
      subject,
      message,
      parts_email: JSON.stringify({ formId: input.formId, source: input.source, values }),
      edited_time: now,
      created_time: now,
      published: false,
    })
    .select('id,created_time')
    .single();

  if (error || !data) throw new Error('Unable to submit customer request.');

  // Initialize operational overlay in customer request states
  try {
    const sql = getPostgresClient();
    const [state] = await sql`
      INSERT INTO cic_customer_request_states (
        workspace, source_type, source_id, status, priority, tags, created_at, updated_at
      ) VALUES (
        'vi', 'contact', ${data.id}, 'new', 'medium', '{}', now(), now()
      )
      ON CONFLICT (workspace, source_type, source_id) DO NOTHING
      RETURNING id
    `;
    if (state?.id) {
      await sql`
        INSERT INTO cic_customer_request_events (
          request_state_id, event_type, old_value, new_value, actor_id, created_at
        ) VALUES (
          ${state.id}, 'created', NULL, ${sql.json({ formId: input.formId, source: input.source, subject })}, NULL, now()
        )
      `;
    }
  } catch (err) {
    console.error('[submitCustomerInteractionAction] Error initializing customer request state:', err);
  }

  return { requestId: String(data.id), submittedAt: String(data.created_time) };
}
