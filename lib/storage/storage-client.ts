import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const uploadBusinessCard = async (file: Blob) => {
  const fileName = `card-${Date.now()}.jpg`
  const { data, error } = await supabase.storage
    .from('business-cards')
    .upload(fileName, file)
  
  if (error) throw error
  return data.path
}

export const uploadVoiceMemo = async (file: Blob) => {
  const fileName = `memo-${Date.now()}.mp3`
  const { data, error } = await supabase.storage
    .from('voice-memos')
    .upload(fileName, file)
  
  if (error) throw error
  return data.path
} 