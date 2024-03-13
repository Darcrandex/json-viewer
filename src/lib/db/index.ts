import { createModel, type DataSchema } from './utils'

export type FileSchema = DataSchema & {
  name: string
}

export type NavSchema = DataSchema & {
  fileId: string
  compareId?: string // 比较文件的 id
}

export type ContentSchema = DataSchema & {
  fileId: string
  content?: string
}

export const db = {
  files: createModel<FileSchema>({ dbName: 'json-viewer', tableName: 'files' }),
  navs: createModel<NavSchema>({ dbName: 'json-viewer', tableName: 'navs' }),
  contents: createModel<ContentSchema>({ dbName: 'json-viewer', tableName: 'contents' }),
}
