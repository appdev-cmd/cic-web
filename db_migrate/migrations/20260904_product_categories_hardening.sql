BEGIN;
SELECT setval(pg_get_serial_sequence('public.cic_permission_tasks','id'),coalesce((SELECT max(id) FROM public.cic_permission_tasks),1),EXISTS(SELECT 1 FROM public.cic_permission_tasks));
UPDATE public.cic_permission_tasks SET view='Danh mục sản phẩm',_task='product_categories',description='Xem, tạo, sửa, thay đổi trạng thái và chuyển danh mục sản phẩm vào Thùng rác',published=true,list_function='view,create,edit,delete' WHERE lower(module)='product_settings';
INSERT INTO public.cic_permission_tasks(module,view,_task,trigger,description,ordering,published,list_field,list_function,is_contents)
SELECT 'product_settings','Danh mục sản phẩm','product_categories',NULL,'Xem, tạo, sửa, thay đổi trạng thái và chuyển danh mục sản phẩm vào Thùng rác',700,true,NULL,'view,create,edit,delete',false
WHERE NOT EXISTS(SELECT 1 FROM public.cic_permission_tasks WHERE lower(module)='product_settings');
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_products_categories_alias_norm ON public.cic_products_categories(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_products_categories_en_alias_norm ON public.cic_products_categories_en(lower(btrim(alias))) WHERE alias IS NOT NULL AND btrim(alias)<>'';
COMMIT;
