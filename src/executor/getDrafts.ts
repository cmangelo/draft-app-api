import { getDrafts } from '../db/db'

export const getDraftsExecutor = async (userId: string) => {
  const res = await getDrafts(userId)
  return res.sort((a, b) => new Date(b.draftDateTime).getTime() - new Date(a.draftDateTime).getTime())
}