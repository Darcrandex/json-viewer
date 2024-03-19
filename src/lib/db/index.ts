import { createModel, type DataSchema } from './utils'

export type FileSchema = DataSchema & {
  name: string
  contentId?: string
}

export type NavSchema = DataSchema & {
  url: string
  fid: string
  cid?: string
}

export type ContentSchema = DataSchema & {
  content: string
  fileId?: string
}

export const db = {
  files: createModel<FileSchema>({ dbName: 'json-viewer', tableName: 'files' }),
  navs: createModel<NavSchema>({ dbName: 'json-viewer', tableName: 'navs' }),
  contents: createModel<ContentSchema>({ dbName: 'json-viewer', tableName: 'contents' }),
}
