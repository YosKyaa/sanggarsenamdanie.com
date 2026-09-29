-- Seed content from facts supplied by the studio.
-- Class schedules and testimonials are intentionally NOT seeded: add the real
-- ones from /admin so the public site never shows invented data.

insert into public.programs (title, slug, summary, description, category, icon, sort_order) values
  ('Aerobic', 'aerobic',
   'Gerakan ritmis intensitas sedang untuk jantung, stamina, dan koordinasi.',
   'Kelas aerobic dengan gerakan ritmis berintensitas sedang yang melatih daya tahan jantung, stamina, dan koordinasi tubuh. Gerakan diajarkan bertahap sehingga nyaman untuk pemula maupun peserta yang sudah rutin berlatih.',
   'studio', 'heart-pulse', 1),
  ('Zumba', 'zumba',
   'Kardio dengan musik Latin yang energik — berkeringat sambil bersenang-senang.',
   'Zumba memadukan gerakan tari dan musik Latin dalam latihan kardio yang menyenangkan. Dipandu instruktur berlisensi ZIN (Zumba Instructor Network), kelas ini cocok bagi Anda yang ingin aktif tanpa merasa sedang "berolahraga berat".',
   'studio', 'music', 2),
  ('Yoga', 'yoga',
   'Latihan napas, kelenturan, dan keseimbangan untuk tubuh yang lebih rileks.',
   'Kelas yoga berfokus pada pernapasan, kelenturan, kekuatan inti, dan keseimbangan. Setiap pose memiliki variasi sehingga dapat disesuaikan dengan kondisi tubuh masing-masing peserta.',
   'studio', 'flower', 3),
  ('Aquarobic', 'aquarobic',
   'Senam aerobik di air — ringan untuk sendi, tetap efektif.',
   'Aquarobic adalah senam aerobik yang dilakukan di dalam air. Daya apung air mengurangi beban pada sendi, sehingga latihan tetap efektif namun lebih aman bagi peserta dengan keluhan lutut atau berat badan berlebih.',
   'aqua', 'waves', 4),
  ('Aquayoga', 'aquayoga',
   'Gerakan yoga di air yang menenangkan dengan beban minimal pada sendi.',
   'Aquayoga membawa gerakan yoga ke dalam air. Air membantu menopang tubuh sehingga peregangan terasa lebih ringan, cocok untuk pemulihan, relaksasi, dan meningkatkan kelenturan.',
   'aqua', 'droplets', 5);

with danie as (
  insert into public.instructors
    (name, slug, role_title, bio, specialization, certifications, experience_years, is_founder, sort_order)
  values
    ('Danie', 'danie', 'Founder & Head Instructor',
     'Danie adalah instruktur senam profesional dengan pengalaman lebih dari 10 tahun di dunia olahraga kebugaran dan senam. Selain memimpin Sanggar Senam Danie, Danie aktif sebagai Sekretaris IOSKI Depok (Ikatan Olahraga Senam Kreasi Indonesia).',
     'Aerobic, Zumba, Yoga, Aquarobic, Aquayoga',
     array['ZIN (Zumba Instructor Network)', 'Aerobic', 'Yoga', 'Aero Boxing', 'Jantung Sehat'],
     10, true, 0)
  returning id
)
insert into public.certificates (instructor_id, title, issuer, sort_order)
select danie.id, c.title, c.issuer, c.sort_order
from danie, (values
  ('ZIN — Zumba Instructor Network', 'Zumba Fitness, LLC', 1),
  ('Sertifikasi Instruktur Aerobic', null, 2),
  ('Sertifikasi Instruktur Yoga', null, 3),
  ('Sertifikasi Aero Boxing', null, 4),
  ('Sertifikasi Senam Jantung Sehat', null, 5)
) as c(title, issuer, sort_order);

-- After creating your admin user in Supabase Auth, promote it:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');

-- SEO content (migration 0002): program details and starter articles.

update public.programs set
  intensity = 'sedang',
  audience = 'Pemula hingga peserta rutin yang ingin meningkatkan stamina dan kebugaran jantung. Gerakan bisa dibuat lebih ringan sesuai kemampuan.',
  benefits = array['Melatih daya tahan jantung dan paru', 'Meningkatkan stamina untuk aktivitas sehari-hari', 'Melatih koordinasi dan keseimbangan', 'Membantu menjaga berat badan bersama pola makan sehat']
where slug = 'aerobic';

update public.programs set
  intensity = 'sedang',
  audience = 'Siapa saja yang ingin berolahraga sambil bersenang-senang — tidak perlu bisa menari. Cocok untuk yang mudah bosan dengan latihan biasa.',
  benefits = array['Membakar kalori lewat gerakan kardio yang menyenangkan', 'Melatih koordinasi dan ritme', 'Membantu memperbaiki suasana hati lewat musik yang energik', 'Melatih daya tahan jantung']
where slug = 'zumba';

update public.programs set
  intensity = 'ringan',
  audience = 'Pemula, pekerja kantoran dengan badan kaku, hingga siapa saja yang ingin lebih rileks. Setiap pose punya variasi yang lebih mudah.',
  benefits = array['Meningkatkan kelenturan tubuh', 'Melatih kekuatan otot inti dan keseimbangan', 'Membantu relaksasi lewat latihan pernapasan', 'Membantu memperbaiki postur tubuh']
where slug = 'yoga';

update public.programs set
  intensity = 'ringan',
  audience = 'Peserta dengan keluhan lutut atau sendi, berat badan berlebih, lansia, atau siapa saja yang ingin olahraga ringan tapi efektif. Konsultasikan dengan dokter bila memiliki kondisi khusus.',
  benefits = array['Beban pada sendi lebih ringan berkat daya apung air', 'Air memberi tahanan alami untuk melatih otot', 'Melatih daya tahan jantung', 'Tubuh terasa sejuk selama berlatih']
where slug = 'aquarobic';

update public.programs set
  intensity = 'ringan',
  audience = 'Siapa saja yang ingin peregangan lembut dan relaksasi, termasuk peserta dalam masa pemulihan atas saran tenaga kesehatan.',
  benefits = array['Peregangan terasa lebih ringan karena air menopang tubuh', 'Meningkatkan kelenturan dan rentang gerak', 'Membantu relaksasi dan mengurangi ketegangan', 'Melatih keseimbangan dengan aman']
where slug = 'aquayoga';

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Zumba untuk Pemula: Panduan Mengikuti Kelas Pertama', 'zumba-untuk-pemula',
  'Baru pertama kali ikut Zumba? Ini yang perlu disiapkan, apa yang terjadi di kelas, dan tips agar tetap nyaman mengikuti gerakan.',
  $md$Zumba sering jadi pilihan pertama orang yang ingin mulai rutin berolahraga. Musiknya ceria, gerakannya berulang, dan suasananya lebih mirip pesta daripada latihan berat. Kalau Anda baru akan mencoba, panduan ini membantu Anda datang dengan tenang.

## Apa itu Zumba?

Zumba adalah latihan kardio yang memadukan gerakan tari dengan musik Latin dan internasional — salsa, merengue, cumbia, reggaeton, hingga lagu pop. Program ini dikembangkan di Kolombia pada 1990-an oleh Alberto "Beto" Pérez. Kelas Zumba resmi dipimpin instruktur berlisensi **ZIN (Zumba Instructor Network)**.

## Apakah Zumba cocok untuk pemula?

Cocok. Anda tidak perlu bisa menari. Setiap lagu biasanya terdiri dari beberapa langkah dasar yang diulang, dan instruktur memberi isyarat sebelum gerakan berganti. Di pertemuan pertama, wajar jika Anda baru mengikuti langkah kakinya saja — itu sudah cukup.

## Yang perlu disiapkan

- **Pakaian olahraga** yang menyerap keringat dan nyaman untuk bergerak.
- **Sepatu olahraga** dengan sol yang tidak terlalu mencengkeram lantai, agar gerakan memutar terasa aman untuk lutut.
- **Air minum** dan handuk kecil.
- **Makan ringan** satu sampai dua jam sebelum kelas, bukan makan besar tepat sebelum berlatih.

## Apa yang terjadi di kelas?

Kelas diawali pemanasan dengan gerakan yang lebih pelan. Setelah itu intensitas naik turun mengikuti lagu — ada lagu yang cepat, ada yang lebih santai untuk mengatur napas. Kelas ditutup dengan pendinginan dan peregangan.

## Tips untuk kelas pertama

1. **Pilih posisi yang bisa melihat instruktur dengan jelas.** Barisan tengah sering jadi tempat paling nyaman.
2. **Ikuti langkah kaki dulu**, gerakan tangan bisa menyusul di pertemuan berikutnya.
3. **Atur intensitas sendiri.** Kalau lelah, buat gerakan lebih kecil atau berjalan di tempat — tetap bergerak lebih baik daripada berhenti mendadak.
4. **Minum sedikit-sedikit** di sela lagu.
5. **Beri tahu instruktur** bila Anda memiliki kondisi kesehatan, sedang hamil, atau baru pulih dari cedera. Jika ragu, konsultasikan dulu dengan dokter.

## Mulai Zumba di Depok

Di Sanggar Senam Danie, kelas Zumba dipandu instruktur berlisensi ZIN dengan suasana yang santai dan bersahabat untuk pemula. Lihat detail [kelas Zumba](/program/zumba) atau tanyakan jadwal terbaru lewat WhatsApp.$md$,
  (select id from public.programs where slug = 'zumba'),
  true;

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Manfaat Senam Aerobic untuk Jantung dan Stamina', 'manfaat-senam-aerobic',
  'Senam aerobic melatih jantung dan paru, membantu menjaga berat badan, dan baik untuk suasana hati. Simak manfaat dan cara memulainya dengan aman.',
  $md$Senam aerobic adalah salah satu olahraga paling mudah dimulai: tidak butuh alat, bisa dilakukan bersama-sama, dan intensitasnya bisa disesuaikan. Berikut manfaat yang bisa Anda rasakan jika melakukannya secara rutin.

## Apa itu senam aerobic?

Senam aerobic adalah rangkaian gerakan ritmis yang melibatkan otot-otot besar tubuh — kaki, lengan, dan tubuh bagian tengah — secara terus-menerus mengikuti musik. Karena dilakukan tanpa henti dalam waktu cukup lama, detak jantung dan napas meningkat secara stabil. Inilah yang melatih sistem jantung dan paru.

## Manfaat senam aerobic

- **Kebugaran jantung dan paru.** Latihan aerobik teratur membuat jantung dan paru bekerja lebih efisien, sehingga aktivitas sehari-hari seperti naik tangga terasa lebih ringan.
- **Stamina lebih baik.** Tubuh terbiasa bergerak lebih lama sebelum merasa lelah.
- **Membantu mengelola berat badan**, terutama bila diimbangi pola makan yang seimbang.
- **Koordinasi dan keseimbangan.** Mengikuti rangkaian gerakan melatih kerja sama antara otak dan otot.
- **Suasana hati dan tidur.** Aktivitas fisik yang teratur berkaitan dengan berkurangnya rasa cemas dan kualitas tidur yang lebih baik.
- **Teman dan motivasi.** Berlatih bersama membuat olahraga lebih mudah dijadikan kebiasaan.

## Seberapa sering sebaiknya?

Organisasi Kesehatan Dunia (WHO) menganjurkan orang dewasa melakukan aktivitas fisik aerobik intensitas sedang **150–300 menit per minggu**, atau 75–150 menit intensitas tinggi. Artinya, tiga kali kelas senam berdurasi sekitar satu jam per minggu sudah memenuhi anjuran minimal. Bagi pemula, mulailah dari satu atau dua kali seminggu, lalu tingkatkan perlahan.

## Memulai dengan aman

1. **Jangan lewatkan pemanasan dan pendinginan.**
2. **Gunakan "tes bicara".** Pada intensitas sedang, Anda masih bisa berbicara tetapi sulit bernyanyi.
3. **Cukupi cairan** sebelum, selama, dan setelah latihan.
4. **Konsultasikan dengan dokter** bila Anda memiliki penyakit jantung, tekanan darah tinggi, diabetes, sedang hamil, atau sudah lama tidak berolahraga.

## Senam aerobic di Sanggar Senam Danie

Kelas aerobic di Sanggar Senam Danie diajarkan bertahap dan setiap gerakan memiliki versi yang lebih ringan. Danie juga bersertifikasi **Senam Jantung Sehat**, sehingga kelas dirancang dengan memperhatikan keamanan jantung peserta. Lihat detail [kelas Aerobic](/program/aerobic).$md$,
  (select id from public.programs where slug = 'aerobic'),
  true;

insert into public.articles (title, slug, excerpt, content, program_id, is_published)
select 'Aquarobic dan Aquayoga: Olahraga di Air yang Ramah Sendi', 'aquarobic-aquayoga-olahraga-ramah-sendi',
  'Daya apung air mengurangi beban pada sendi sehingga olahraga terasa lebih ringan. Kenali aquarobic dan aquayoga serta siapa yang cocok mengikutinya.',
  $md$Tidak semua orang nyaman melompat atau berlari di lantai studio. Lutut yang sering nyeri, berat badan berlebih, atau usia bisa membuat olahraga terasa berat. Di sinilah olahraga di air menjadi pilihan menarik.

## Kenapa berolahraga di air?

- **Beban pada sendi berkurang.** Daya apung air menopang sebagian berat tubuh, sehingga lutut, pinggul, dan pinggang menanggung beban lebih ringan dibanding latihan di darat.
- **Otot tetap bekerja.** Air memberi tahanan ke segala arah. Setiap gerakan mendorong air, sehingga otot terlatih tanpa perlu beban tambahan.
- **Tubuh terasa sejuk.** Air membantu tubuh tidak cepat kepanasan, walaupun Anda tetap berkeringat dan perlu minum.

## Apa bedanya aquarobic dan aquayoga?

**Aquarobic** adalah senam aerobik di dalam air: gerakan berirama dengan musik, seperti berjalan, menendang, dan mengayun lengan. Fokusnya melatih daya tahan jantung dan kekuatan otot.

**Aquayoga** membawa pose dan pernapasan yoga ke dalam air. Temponya lebih pelan, fokus pada kelenturan, keseimbangan, dan relaksasi. Air membantu menopang tubuh sehingga peregangan terasa lebih ringan.

## Siapa yang cocok?

- Pemula yang ingin mulai berolahraga dengan intensitas ringan.
- Peserta dengan berat badan berlebih.
- Lansia yang ingin tetap aktif dengan risiko benturan yang lebih kecil.
- Peserta dengan keluhan lutut atau pinggang ringan — **dengan persetujuan dokter atau fisioterapis**.

## Apakah harus bisa berenang?

Umumnya tidak. Kelas di air biasanya dilakukan di bagian kolam yang cukup dangkal sehingga kaki tetap menapak. Tanyakan kedalaman kolam kepada kami jika Anda belum percaya diri di air.

## Yang perlu dibawa

- Pakaian renang yang nyaman untuk bergerak.
- Handuk dan sandal.
- Air minum — tubuh tetap berkeringat walaupun di dalam air.
- Penutup kepala renang bila diwajibkan oleh pengelola kolam.

## Kelas air di Sanggar Senam Danie

Sanggar Senam Danie membuka kelas [Aquarobic](/program/aquarobic) dan [Aquayoga](/program/aquayoga). Lokasi dan jadwal kelas air bisa Anda tanyakan langsung lewat WhatsApp.$md$,
  (select id from public.programs where slug = 'aquarobic'),
  true;

-- Editable site content (migration 0003). Values match the site defaults.

insert into public.site_settings (id, whatsapp, instagram_url, response_time, tagline, description, hero_description, founded_date, credentials, address_street, address_district, address_city, address_region, address_postal_code, maps_query, founder_name, founder_title, founder_experience_years, organization, organization_long, organization_role, founder_photo_2_url, class_photo_url, studio_photo_url)
values (1, '6288975351853', null, 'dalam 1×24 jam', 'Studio Senam Profesional Depok', 'Studio senam profesional di Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga bersama instruktur bersertifikasi.', 'Studio senam di Tapos, Depok dengan kelas Aerobic, Zumba, Yoga, Aquarobic, dan Aquayoga — dipandu instruktur bersertifikasi.', '2017-07-27', array['ZIN Certified', 'Aerobic', 'Yoga', 'Aero Boxing', 'Jantung Sehat']::text[], 'Sukamaju Baru', 'Tapos', 'Depok', 'Jawa Barat', '16455', 'Sukamaju Baru, Tapos, Depok, Jawa Barat 16455', 'Danie', 'Founder Sanggar Senam Danie', 10, 'IOSKI Depok', 'Ikatan Olahraga Senam Kreasi Indonesia', 'Sekretaris', null, null, null)
on conflict (id) do nothing;

insert into public.faqs (question, answer, sort_order) values
  ('Apakah pemula boleh ikut kelas?', 'Boleh. Gerakan diajarkan bertahap dan setiap gerakan punya variasi yang lebih ringan, jadi Anda bisa berlatih sesuai kemampuan.', 1),
  ('Bagaimana cara bergabung?', 'Cukup chat kami di WhatsApp +62 889-7535-1853. Kami bantu pilihkan kelas dan jadwal yang paling cocok untuk Anda.', 2),
  ('Berapa biaya kelas senam di Sanggar Senam Danie?', 'Biaya berbeda untuk setiap program. Silakan tanyakan info biaya terbaru lewat WhatsApp — kami jawab dengan senang hati.', 3),
  ('Di mana lokasi Sanggar Senam Danie?', 'Sanggar Senam Danie berada di Sukamaju Baru, Kecamatan Tapos, Kota Depok, Jawa Barat 16455. Lokasi kelas air (Aquarobic dan Aquayoga) tercantum pada jadwal masing-masing kelas.', 4),
  ('Apa yang perlu dibawa saat kelas pertama?', 'Pakaian olahraga yang nyaman, sepatu olahraga untuk kelas studio, air minum, dan handuk kecil. Untuk kelas air, bawa pakaian renang, handuk, dan sandal.', 5),
  ('Kelas mana yang cocok untuk yang punya keluhan lutut atau sendi?', 'Aquarobic dan Aquayoga biasanya paling nyaman karena air mengurangi beban pada sendi. Beri tahu instruktur tentang kondisi Anda, dan konsultasikan dengan dokter bila perlu.', 6),
  ('Apakah studio bisa disewa?', 'Bisa. Studio dapat disewa untuk kelas privat, gathering komunitas, wellness event, dan sesi latihan melalui halaman Sewa Studio.', 7);

insert into public.stats (value, suffix, label, count_up, sort_order) values
  (2017, '', 'Berdiri Sejak', false, 1),
  (10, '+', 'Tahun Pengalaman', true, 2),
  (500, '+', 'Peserta Terlatih', true, 3),
  (5, '', 'Program Kelas', true, 4);

insert into public.brand_pillars (word, title, description, sort_order) values
  ('Sehat', 'Gerakan aman dan terarah', 'Setiap kelas dipandu instruktur bersertifikat, dengan variasi gerakan untuk pemula hingga peserta rutin.', 1),
  ('Aktif', 'Pilihan kelas yang beragam', 'Aerobic, Zumba, Yoga, hingga kelas di air — tetap semangat bergerak tanpa merasa bosan.', 2),
  ('Bahagia', 'Komunitas yang saling mendukung', 'Berlatih bersama teman-teman satu sanggar, sehingga olahraga menjadi momen yang dinanti.', 3);

insert into public.rental_uses (title, description, sort_order) values
  ('Private class', 'Sesi eksklusif untuk Anda atau kelompok kecil.', 1),
  ('Community gathering', 'Arisan sehat, komunitas, dan acara kantor.', 2),
  ('Wellness event', 'Workshop, seminar kesehatan, dan kelas tamu.', 3),
  ('Training', 'Latihan tim, persiapan lomba, dan pelatihan instruktur.', 4);
