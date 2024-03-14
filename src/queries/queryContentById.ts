import { db } from '@/lib/db'

export function queryContentById(id?: string) {
  return {
    enabled: !!id,
    retry: false,
    queryKey: ['content', id],
    queryFn: async () => {
      const res = await db.contents.getById(id || '')
      if (res) {
        return res
      } else {
        throw new Error('content not found')
      }
    },
  }
}
