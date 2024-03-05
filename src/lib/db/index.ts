'use client'

import localforage from 'localforage'
import { nanoid } from 'nanoid'
import { FileItem } from './scheme/file-item'
import { JSONData } from './scheme/json-data'

const myStore = localforage.createInstance({
  name: 'json-viewer',
  storeName: 'jsonData',
})

const FILE_LIST_KEY = 'fileList'

export const db = {
  fileList: {
    getAll: () => {
      return myStore.getItem<FileItem[]>(FILE_LIST_KEY)
    },

    create: async (fileItem: Omit<FileItem, 'id'>) => {
      const id = nanoid()
      const item = { ...fileItem, id }
      const list = await myStore.getItem<FileItem[]>(FILE_LIST_KEY)

      if (!list) {
        await myStore.setItem(FILE_LIST_KEY, [item])
      } else {
        await myStore.setItem(FILE_LIST_KEY, [...list, item])
      }

      return id
    },

    update: async (fileItem: FileItem) => {
      const list = await myStore.getItem<FileItem[]>(FILE_LIST_KEY)
      const newList = (list || []).map((item) => (item.id === fileItem.id ? fileItem : item))
      await myStore.setItem(FILE_LIST_KEY, newList)
    },

    remove: async (id: string) => {
      const list = await myStore.getItem<FileItem[]>(FILE_LIST_KEY)
      const newList = (list || []).filter((item) => item.id !== id)
      await myStore.setItem(FILE_LIST_KEY, newList)
    },
  },

  items: {
    create: async (data: JSONData) => {
      await myStore.setItem(data.id, data)
      return data.id
    },

    getById: async (id: string) => {
      return await myStore.getItem<JSONData>(id)
    },

    update: async (data: JSONData) => {
      await myStore.setItem(data.id, data)
    },

    remove: async (id: string) => {
      await myStore.removeItem(id)
    },
  },
}
