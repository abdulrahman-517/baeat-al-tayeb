-- ============================================
-- Seed Data for بائعة الطيب
-- ============================================

-- Insert sample categories (if not already present)
INSERT INTO categories (name, slug) VALUES
  ('الملابس', 'clothing'),
  ('البخور', 'incense'),
  ('العطور', 'perfumes')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (name, description, price, original_price, sizes, category_id, stock_quantity, images_urls, is_best_seller, type) VALUES
-- Clothing
(
  'عباية سوداء ملكية',
  'عباية سوداء فاخرة بتطريز ذهبي أنيق، مصنوعة من أجود أنواع القماش الناعم. تتميز بتصميمها العصري الذي يجمع بين الفخامة والراحة.',
  12000,
  15000,
  ARRAY['S', 'M', 'L', 'XL'],
  (SELECT id FROM cat WHERE slug = 'clothing'),
  50,
  ARRAY['https://images.unsplash.com/photo-1611416456920-12c2c3b81ae8?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'عبايات'
),
(
  'فستان تركواز فاخر',
  'فستان تركواز طويل بقصة أميرية، مناسب للمناسبات الخاصة. مصنوع من الحرير الطبيعي مع لمسة من الأناقة العصرية.',
  8500,
  10000,
  ARRAY['M', 'L', 'XL'],
  (SELECT id FROM cat WHERE slug = 'clothing'),
  30,
  ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'فساتين'
),
(
  'طقم كاجوال أنيق',
  'طقم نسائي كاجوال مكون من بنطال وجاكيت بقصة عصرية. مناسب للخروجات اليومية والمناسبات غير الرسمية.',
  5500,
  NULL,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  (SELECT id FROM cat WHERE slug = 'clothing'),
  40,
  ARRAY['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80'],
  FALSE,
  'أطقم نسائية'
),
(
  'شال حريري ذهبي',
  'شال حريري ناعم باللون الذهبي مع تطريزات شرقية أنيقة. يضفي لمسة من الفخامة على أي إطلالة.',
  3200,
  4000,
  ARRAY['One Size'],
  (SELECT id FROM cat WHERE slug = 'clothing'),
  100,
  ARRAY['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'شالات'
),
-- Incense
(
  'بخور عود فاخر',
  'بخور عود طبيعي فاخر من أجود أنواع العود الهندي. يتميز برائحته الدافئة والثابتة التي تدوم طويلاً.',
  8000,
  10000,
  ARRAY['50g', '100g', '200g'],
  (SELECT id FROM cat WHERE slug = 'incense'),
  60,
  ARRAY['https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'بخور عود'
),
(
  'معمول بخور ملكي',
  'معمول بخور ملكي بمزيج من العود والمسك والعنبر. يجمع بين الفخامة الشرقية والثبات العالي.',
  5000,
  6500,
  ARRAY['30g', '60g', '120g'],
  (SELECT id FROM cat WHERE slug = 'incense'),
  45,
  ARRAY['https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'معمول'
),
(
  'مبخرة فاخرة',
  'مبخرة يدوية الصنع من النحاس الأصفر المطلي بالذهب. تصميم شرقي أصيل يضفي فخامة على المجلس.',
  3500,
  NULL,
  ARRAY['One Size'],
  (SELECT id FROM cat WHERE slug = 'incense'),
  25,
  ARRAY['https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80'],
  FALSE,
  'مباخر'
),
(
  'دهن عود كمبودي',
  'دهن عود كمبودي فاخر، من أندر أنواع دهن العود في العالم. رائحة عميقة ودافئة مع ثبات أسطوري.',
  15000,
  18000,
  ARRAY['3ml', '6ml', '12ml'],
  (SELECT id FROM cat WHERE slug = 'incense'),
  20,
  ARRAY['https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'دهن عود'
),
-- Perfumes
(
  'عطر مسك أبيض',
  'عطر مسك أبيض نقي بتركيبة فرنسية أصيلة. عطر ناعم ومنعش يناسب جميع الأوقات.',
  2500,
  3000,
  ARRAY['30ml', '50ml', '100ml'],
  (SELECT id FROM cat WHERE slug = 'perfumes'),
  80,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'مسك'
),
(
  'عطر ورد الجوري',
  'عطر شرقي فاخر بمزيج من الورد الجوري والمسك الأبيض والعنبر. عطر أنثوي جذاب وثابت.',
  4500,
  NULL,
  ARRAY['30ml', '50ml', '100ml'],
  (SELECT id FROM cat WHERE slug = 'perfumes'),
  50,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'],
  FALSE,
  'عطور شرقية'
),
(
  'عطر عنبر فاخر',
  'عطر عنبر فاخر بتركيبة شرقية أصيلة. رائحة دافئة وحسية تناسب الأمسيات والمناسبات الخاصة.',
  6000,
  7500,
  ARRAY['30ml', '50ml', '100ml'],
  (SELECT id FROM cat WHERE slug = 'perfumes'),
  35,
  ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80'],
  TRUE,
  'عطور شرقية'
)
ON CONFLICT DO NOTHING;
