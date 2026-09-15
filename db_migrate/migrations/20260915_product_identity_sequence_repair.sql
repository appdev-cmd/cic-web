BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:products:identity-sequence-repair', 0));

DO $$
DECLARE
  target_table text;
  sequence_name text;
  maximum_id bigint;
  current_value bigint;
BEGIN
  FOREACH target_table IN ARRAY ARRAY['cic_products_images', 'cic_products_images_en']
  LOOP
    sequence_name := pg_get_serial_sequence('public.' || target_table, 'id');
    EXECUTE format('SELECT max(id) FROM public.%I', target_table) INTO maximum_id;
    EXECUTE format('SELECT last_value FROM %s', sequence_name) INTO current_value;

    IF maximum_id IS NOT NULL AND current_value < maximum_id THEN
      PERFORM setval(sequence_name, maximum_id, true);
    END IF;
  END LOOP;
END $$;

COMMIT;
