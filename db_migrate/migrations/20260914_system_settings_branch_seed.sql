BEGIN;
SELECT pg_advisory_xact_lock(hashtextextended('cic:system-settings:branch-seed', 0));

-- One-time, reviewed mapping from cic_address/cic_address_en HTML. Runtime never parses legacy HTML.
INSERT INTO cic_branches (workspace,code,name,address,phone,email,fax,working_hours,map_embed_url,map_search_query,is_head_office,published,ordering)
VALUES
  ('vi','tru-so-ha-noi','Trụ sở chính Hà Nội','Tầng 4, Tòa nhà VG Building, Số 235 Nguyễn Trãi, Phường Khương Đình, Hà Nội','(84-24) 39 761 381 - (84-24) 39 741 313','info@cic.com.vn','(84-24) 38 216 793','','','CIC Technology, 235 Nguyễn Trãi, Hà Nội',true,true,0),
  ('vi','chi-nhanh-ho-chi-minh','Chi nhánh Thành phố Hồ Chí Minh','Số 36 Nguyễn Huy Lượng, Phường Bình Thạnh, Thành phố Hồ Chí Minh','088 645 2020 - (+84 28) 62899022 - (+84 28) 62899033','cichcm@cic.com.vn','(+84 28) 62899033','','','CIC Technology, 36 Nguyễn Huy Lượng, Thành phố Hồ Chí Minh',false,true,1),
  ('en','hanoi-head-office','Hanoi Head Office','VG Building, No. 235 Nguyen Trai, Khuong Dinh Ward, Ha Noi','(+84 24) 39 761 381 / (+84 24) 39 741 313','info@cic.com.vn','(+84 24) 38 216 793','','','CIC Technology, 235 Nguyen Trai, Ha Noi',true,true,0),
  ('en','ho-chi-minh-branch','Ho Chi Minh Branch','No. 36 Nguyen Huy Luong, Binh Thanh Ward, Ho Chi Minh City','(+84 28) 628 99 022 / (+84 28) 628 99 033','cichcm@cic.com.vn','(+84 28) 628 99 033','','','CIC Technology, 36 Nguyen Huy Luong, Ho Chi Minh City',false,true,1)
ON CONFLICT (workspace,code) DO NOTHING;

DO $$
BEGIN
  IF (SELECT count(*) FROM cic_branches WHERE workspace='vi') < 2 OR (SELECT count(*) FROM cic_branches WHERE workspace='en') < 2 THEN
    RAISE EXCEPTION 'System Settings branch seed verification failed';
  END IF;
END $$;
COMMIT;
