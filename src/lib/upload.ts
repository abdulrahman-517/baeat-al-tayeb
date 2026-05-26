import { supabase } from './supabase'

const BUCKET_NAME = 'product-images'

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return data.publicUrl
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    const url = await uploadImage(file)
    urls.push(url)
  }
  return urls
}

export async function deleteImage(url: string) {
  const path = url.split(`${BUCKET_NAME}/`)[1]
  if (!path) return

  await supabase.storage.from(BUCKET_NAME).remove([path])
}
