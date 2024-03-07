'use client'

import { createModel } from './utils'

export type FileSchema = {
  id: string
  name: string
}

export type NavSchema = {
  id: string
  fileId: string
  compareId?: string
}

export type ContentSchema = {
  id: string
  fileId: string
  content?: string
}

export const db = {
  files: createModel<FileSchema>({ dbName: 'json-viewer', tableName: 'files' }),
  navs: createModel<NavSchema>({ dbName: 'json-viewer', tableName: 'navs' }),
  contents: createModel<ContentSchema>({ dbName: 'json-viewer', tableName: 'contents' }),
}
