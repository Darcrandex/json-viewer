'use client'

import localforage from 'localforage'
import { nanoid } from 'nanoid'

export function createModel<T extends { id: string }>(options: { dbName: string; tableName: string }) {
  const table = localforage.createInstance({
    name: options.dbName,
    storeName: options.tableName,
  })

  return {
    async create(data: Omit<T, 'id'>) {
      const id = nanoid()
      await table.setItem(id, { ...data, id })
      return id
    },

    async getById(id: string) {
      return await table.getItem<T>(id)
    },

    async update(data: T) {
      await table.setItem(data.id, data)
    },

    async remove(id: string) {
      await table.removeItem(id)
    },

    async getAll() {
      const res: T[] = []
      await table.iterate<T, void>((value) => {
        res.push(value)
      })

      return res
    },

    async count() {
      return await table.length()
    },
  }
}
