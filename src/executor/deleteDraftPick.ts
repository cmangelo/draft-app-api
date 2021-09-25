import { deleteDraftPick } from '../db/db'

export const deleteDraftPickExecutor = async (draftId: string, pickNumber: number) => {
  await deleteDraftPick(draftId, pickNumber)
}