import { getDrafts } from '../db/db'

export const getDraftsExecutor = async (userId: string) => {
  return await getDrafts(userId)
}