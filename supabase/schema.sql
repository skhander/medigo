-- MediGo Supabase schema
-- Run this in the Supabase SQL editor to set up the database.

create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  country text not null,
  city text not null,
  address text not null,
  description text not null,
  accreditations text[] not null default '{}',
  procedures text[] not null default '{}',
  procedure_prices jsonb not null default '[]',
  lat numeric not null default 0,
  lng numeric not null default 0,
  map_embed_url text not null,
  contact_email text not null,
  contact_phone text not null,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists providers_country_idx on providers (country);
create index if not exists providers_procedures_idx on providers using gin (procedures);
create index if not exists providers_name_idx on providers (name);

alter table providers enable row level security;

create policy "Providers are publicly readable"
  on providers for select
  using (true);

-- Seed data (optional — app falls back to hardcoded data if Supabase is not configured)
insert into providers (
  name, slug, country, city, address, description,
  accreditations, procedures, procedure_prices,
  map_embed_url, contact_email, contact_phone, rating, review_count
) values
(
  'Baja Dental Excellence', 'baja-dental-excellence', 'Mexico', 'Tijuana',
  'Av. Revolución 1234, Zona Centro, Tijuana, Baja California',
  'Premier dental clinic specializing in implants, veneers, and full-mouth restorations for international patients.',
  array['JCI', 'ISO 9001', 'ADA Member'],
  array['Dental Implants', 'Cosmetic Surgery'],
  '[{"name":"Single Dental Implant","priceUsd":890},{"name":"All-on-4 Implants","priceUsd":8500},{"name":"Porcelain Veneers (per tooth)","priceUsd":320},{"name":"Teeth Whitening","priceUsd":180}]'::jsonb,
  'https://maps.google.com/maps?q=32.5149,-117.0382&z=15&output=embed',
  'info@bajadental.com', '+52 664 123 4567', 4.9, 342
),
(
  'Cancún Medical Center', 'cancun-medical-center', 'Mexico', 'Cancún',
  'Blvd. Kukulcan Km 12.5, Zona Hotelera, Cancún, Quintana Roo',
  'Full-service hospital offering orthopedic, bariatric, and cosmetic procedures with resort-style recovery packages.',
  array['JCI', 'CSG-Certified', 'ISO 14001'],
  array['Knee Replacement', 'Hip Replacement', 'Bariatric Surgery', 'Cosmetic Surgery'],
  '[{"name":"Knee Replacement","priceUsd":12500},{"name":"Hip Replacement","priceUsd":11800},{"name":"Gastric Sleeve","priceUsd":5200},{"name":"Tummy Tuck","priceUsd":4800}]'::jsonb,
  'https://maps.google.com/maps?q=21.1619,-86.8515&z=15&output=embed',
  'contact@cancunmedical.com', '+52 998 234 5678', 4.8, 218
),
(
  'Bangkok Fertility Institute', 'bangkok-fertility-institute', 'Thailand', 'Bangkok',
  '88 Sukhumvit Road, Watthana, Bangkok 10110',
  'Leading fertility center with world-class IVF success rates and personalized treatment plans for couples worldwide.',
  array['JCI', 'RTAC Accredited', 'ISO 15189'],
  array['IVF'],
  '[{"name":"IVF Cycle (standard)","priceUsd":6500},{"name":"IVF with ICSI","priceUsd":7800},{"name":"Egg Freezing","priceUsd":3200},{"name":"PGT Genetic Testing","priceUsd":1800}]'::jsonb,
  'https://maps.google.com/maps?q=13.7563,100.5018&z=15&output=embed',
  'hello@bangkokfertility.th', '+66 2 123 4567', 4.9, 567
),
(
  'Phuket International Hospital', 'phuket-international-hospital', 'Thailand', 'Phuket',
  '44 Chalermprakiat Ror 9 Rd, Mueang Phuket District',
  'Accredited multi-specialty hospital popular with medical tourists seeking orthopedic and cosmetic procedures.',
  array['JCI', 'HA Thailand', 'ISO 9001'],
  array['Knee Replacement', 'Hip Replacement', 'Cosmetic Surgery', 'LASIK Eye Surgery'],
  '[{"name":"Knee Replacement","priceUsd":9800},{"name":"Hip Replacement","priceUsd":9200},{"name":"Rhinoplasty","priceUsd":3500},{"name":"LASIK (both eyes)","priceUsd":2200}]'::jsonb,
  'https://maps.google.com/maps?q=7.8804,98.3923&z=15&output=embed',
  'info@phukethospital.th', '+66 76 234 5678', 4.7, 891
),
(
  'Apollo MedTour India', 'apollo-medtour-india', 'India', 'New Delhi',
  'Sarita Vihar, Delhi Mathura Road, New Delhi 110076',
  'Part of India''s largest healthcare network, offering cardiac, orthopedic, and transplant procedures at competitive prices.',
  array['JCI', 'NABH', 'NABL'],
  array['Cardiac Bypass', 'Knee Replacement', 'Spine Surgery', 'IVF'],
  '[{"name":"Coronary Bypass (CABG)","priceUsd":6500},{"name":"Knee Replacement","priceUsd":5500},{"name":"Spine Fusion","priceUsd":7200},{"name":"IVF Cycle","priceUsd":2800}]'::jsonb,
  'https://maps.google.com/maps?q=28.5355,77.2910&z=15&output=embed',
  'medtour@apolloindia.com', '+91 11 2692 5858', 4.8, 1243
),
(
  'Chennai Eye & Laser Center', 'chennai-eye-laser-center', 'India', 'Chennai',
  '21 Greams Road, Thousand Lights, Chennai 600006',
  'Specialized ophthalmology center performing LASIK, cataract surgery, and retinal treatments for international patients.',
  array['NABH', 'ISO 9001', 'AAO Member'],
  array['LASIK Eye Surgery'],
  '[{"name":"LASIK (both eyes)","priceUsd":800},{"name":"PRK (both eyes)","priceUsd":650},{"name":"Cataract Surgery (per eye)","priceUsd":450},{"name":"SMILE Procedure","priceUsd":1200}]'::jsonb,
  'https://maps.google.com/maps?q=13.0569,80.2425&z=15&output=embed',
  'appointments@chennaieye.in', '+91 44 2829 3333', 4.9, 456
),
(
  'Istanbul Hair & Aesthetics', 'istanbul-hair-aesthetics', 'Turkey', 'Istanbul',
  'Nişantaşı, Teşvikiye Cd. No: 45, Şişli, Istanbul',
  'Turkey''s top destination for hair transplants and cosmetic procedures, combining expert surgeons with luxury recovery hotels.',
  array['JCI', 'ISHRS Member', 'ISO 9001'],
  array['Hair Transplant', 'Cosmetic Surgery'],
  '[{"name":"FUE Hair Transplant (3000 grafts)","priceUsd":2200},{"name":"DHI Hair Transplant","priceUsd":2800},{"name":"Rhinoplasty","priceUsd":3200},{"name":"Facelift","priceUsd":4500}]'::jsonb,
  'https://maps.google.com/maps?q=41.0488,28.9955&z=15&output=embed',
  'info@istanbulhair.tr', '+90 212 345 6789', 4.8, 2104
),
(
  'Ankara Orthopedic Specialists', 'ankara-orthopedic-specialists', 'Turkey', 'Ankara',
  'Bilkent Plaza B1 Blok, Bilkent, Çankaya, Ankara',
  'Dedicated orthopedic hospital with robotic-assisted joint replacement and spine surgery programs.',
  array['JCI', 'TEMOS', 'ISO 15189'],
  array['Knee Replacement', 'Hip Replacement', 'Spine Surgery'],
  '[{"name":"Knee Replacement (robotic)","priceUsd":8900},{"name":"Hip Replacement","priceUsd":8200},{"name":"Spine Disc Replacement","priceUsd":11500},{"name":"ACL Reconstruction","priceUsd":3800}]'::jsonb,
  'https://maps.google.com/maps?q=39.8719,32.7473&z=15&output=embed',
  'ortho@ankaraspecialists.tr', '+90 312 456 7890', 4.7, 389
),
(
  'Costa Rica Dental & Wellness', 'costa-rica-dental-wellness', 'Costa Rica', 'San José',
  'Escazú Medical Center, San Rafael de Escazú, San José',
  'Boutique dental clinic in the Escazú hills offering implants, crowns, and holistic wellness packages.',
  array['AAID', 'ISO 9001', 'Costa Rica Medical Tourism Board'],
  array['Dental Implants', 'Cosmetic Surgery'],
  '[{"name":"Single Dental Implant","priceUsd":950},{"name":"All-on-4 Implants","priceUsd":9200},{"name":"Dental Crown (porcelain)","priceUsd":420},{"name":"Full Mouth Reconstruction","priceUsd":15000}]'::jsonb,
  'https://maps.google.com/maps?q=9.9187,-84.1399&z=15&output=embed',
  'smile@crwellness.co.cr', '+506 2222 3333', 4.9, 278
),
(
  'Liberty Medical Costa Rica', 'liberty-medical-costa-rica', 'Costa Rica', 'Liberia',
  'Centro Comercial Plaza Real, Liberia, Guanacaste',
  'Gateway clinic near Liberia airport specializing in bariatric surgery and orthopedic care with beach recovery options.',
  array['JCI', 'Promed', 'ISO 14001'],
  array['Bariatric Surgery', 'Knee Replacement', 'Hip Replacement'],
  '[{"name":"Gastric Bypass","priceUsd":9800},{"name":"Gastric Sleeve","priceUsd":7500},{"name":"Knee Replacement","priceUsd":13200},{"name":"Hip Replacement","priceUsd":12800}]'::jsonb,
  'https://maps.google.com/maps?q=10.6350,-85.4377&z=15&output=embed',
  'info@libertymedical.cr', '+506 2666 4444', 4.6, 156
)
on conflict (slug) do nothing;
