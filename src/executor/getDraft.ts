import { getDraft } from '../db/db'

export const getDraftExecutor = async (draftId: string) => {
  return await getDraft(draftId)
}