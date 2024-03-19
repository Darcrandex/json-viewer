/**
 * @name AsideMenus
 * @description
 * @author darcrand
 */

import { FileSchema, db } from '@/lib/db'
import IconButton from '@/ui/IconButton'
import { cls } from '@/utils/cls'
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import ClearButton from './ClearButton'
import ListItem from './ListItem'

export type AsideMenusProps = { className?: string }
export default function AsideMenus(props: AsideMenusProps) {
  const { data: fileList } = useQuery({
    queryKey: ['files'],
    queryFn: () => db.files.getAll(),
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutateAsync: createFile } = useMutation({
    mutationFn: async () => {
      const fileId = await db.files.create({ name: 'new file' })
      const contentId = await db.contents.create({ fileId, content: '' })
      const fileData = await db.files.getById(fileId)
      if (fileData) {
        await db.files.update({ ...fileData, contentId })
      }

      return fileId
    },
    onSuccess(id) {
      navigate(`/${id}`, { replace: true })
      queryClient.invalidateQueries({ queryKey: ['files'] })
    },
  })

  const { mutateAsync: removeFile } = useMutation({
    mutationFn: async (id: string) => {
      await db.files.remove(id)
      const fileData = await db.files.getById(id)
      if (fileData?.contentId) {
        await db.contents.remove(fileData.contentId)
      }

      return id
    },
    onSuccess(id) {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['file', id] })
    },
  })

  const { mutateAsync: updateFile } = useMutation({
    mutationFn: async (data: FileSchema) => {
      await db.files.update(data)
      return data.id
    },
    onSuccess(id) {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['file', id] })
    },
  })

  const currId = useParams().id
  const compareFile = (cid: string) => {
    if (currId) {
      navigate(`/${currId}?cid=${cid}`, { replace: true })
    }
  }

  const onClear = async () => {
    await db.files.clear()
    await db.contents.clear()
    await db.navs.clear()
    window.localStorage.clear()
    queryClient.invalidateQueries({ queryKey: [] })
    navigate('/', { replace: true })
  }

  return (
    <>
      <aside className={cls(props.className)}>
        <section className='space-x-4 p-4 text-right'>
          <IconButton icon={faFileCirclePlus} onClick={() => createFile()} />
          <ClearButton onClear={onClear} />
        </section>

        <nav>
          {fileList?.map((v) => (
            <ListItem
              key={v.id}
              value={v}
              onRemove={removeFile}
              onChange={updateFile}
              onCompare={compareFile}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}
