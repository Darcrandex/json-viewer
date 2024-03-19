import localforage from 'localforage'
import { customAlphabet } from 'nanoid'
import * as R from 'ramda'

const createId = () => customAlphabet('1234567890abcdef', 8)()

export type DataSchema = {
  id: string
  createdAt: number
  updatedAt: number
}

export function createModel<T extends DataSchema>(options: { dbName: string; tableName: string }) {
  const table = localforage.createInstance({
    name: options.dbName,
    storeName: options.tableName,
  })

  return {
    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
      const id = createId()
      await table.setItem(id, { ...data, id, createdAt: Date.now(), updatedAt: Date.now() })
      return id
    },

    async getById(id: string) {
      return await table.getItem<T>(id)
    },

    async update(data: Omit<T, 'createdAt' | 'updatedAt'>) {
      await table.setItem(data.id, { ...data, updatedAt: Date.now() })
    },

    async remove(id: string) {
      await table.removeItem(id)
    },

    async getAll() {
      const res: T[] = []
      await table.iterate<T, void>((value) => {
        res.push(value)
      })

      return R.sortWith([R.ascend(R.prop('createdAt'))], res)
    },

    async count() {
      return await table.length()
    },

    async clear() {
      await table.clear()
    },
  }
}
