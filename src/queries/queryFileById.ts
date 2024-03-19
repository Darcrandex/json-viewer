import { db } from '@/lib/db'

export function queryFileById(id?: string) {
  return {
    enabled: !!id,
    retry: false,
    queryKey: ['file', id],
    queryFn: async () => {
      const res = await db.files.getById(id || '')
      if (res) {
        return res
      } else {
        throw new Error('file not found')
      }
    },
  }
}
