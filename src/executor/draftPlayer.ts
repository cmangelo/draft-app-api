import { draftPlayer } from '../db/db'

export const draftPlayerExecutor = async (draftId: string, playerId: string, pickNumber: number) => {
  await draftPlayer(draftId, playerId, pickNumber)
}