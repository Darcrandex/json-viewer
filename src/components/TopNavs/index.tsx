/**
 * @name TopNavs
 * @description
 * @author darcrand
 */

import { NavSchema, db } from '@/lib/db'
import { cls } from '@/utils/cls'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'

export default function TopNavs() {
  const { data } = useQuery({
    queryKey: ['navs'],
    queryFn: () => db.navs.getAll(),
  })

  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { mutate: onRemove } = useMutation({
    mutationFn: async (navItem: NavSchema) => {
      const navPath = `/files/${navItem.fileId}`
      const nextPath = undefined

      await db.navs.remove(navItem.id)
      return nextPath
    },
    onSuccess: (nextPath) => {
      queryClient.invalidateQueries({ queryKey: ['navs'] })

      if (nextPath) {
        router.replace(nextPath)
      } else {
        router.replace('/files')
      }
    },
  })

  const onNavigate = (data: NavSchema) => {
    router.push(`/files/${data.fileId}`)
  }

  return (
    <>
      <nav className='flex flex-nowrap'>
        {data?.map((v) => (
          <NavItem key={v.id} data={v} onClick={() => onNavigate(v)} onRemove={() => onRemove(v)} />
        ))}
      </nav>
    </>
  )
}

function NavItem(props: { data: NavSchema; onClick?: () => void; onRemove?: () => void }) {
  const fileId = props.data.fileId

  const { data: fileData } = useQuery({
    queryKey: ['file', 'item', fileId],
    enabled: !!fileId,
    queryFn: () => db.files.getById(fileId || ''),
  })

  return (
    <div className={cls('p-4 space-x-2 text-white')} onClick={() => props.onClick?.()}>
      <span>{fileData?.name}</span>
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          props.onRemove?.()
        }}
      >
        x
      </button>
    </div>
  )
}
