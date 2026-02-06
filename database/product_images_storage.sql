-- =====================================================
-- Product Images Storage Configuration
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Policy: Anyone can view product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy: Only admins can upload (via service role key in API)
-- Note: The API uses the service role key, so uploads bypass RLS
-- This policy just ensures public read access

-- =====================================================
-- Verify bucket was created:
-- SELECT * FROM storage.buckets WHERE id = 'product-images';
-- =====================================================
