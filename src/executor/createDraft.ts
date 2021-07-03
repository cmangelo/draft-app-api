import { addDraftToUserDrafts, createDraft, getLatestRankingsVersions } from '../db/db'
import { CreateDraftResponse, DraftConfig, DraftOrder } from '../model/draft'

export const createDraftExecutor = async (
  userId: string, 
  draftConfig: DraftConfig, 
  ownerDraftPosition: number
): Promise<CreateDraftResponse> => {
  const draftOrder = createDraftOrder(userId, draftConfig.numDrafters, ownerDraftPosition)
  draftConfig.owner = userId
  if (!draftConfig.draftName)
    draftConfig.draftName = `${draftConfig.numDrafters} Person Draft`

  const latestRankingsVersions = await getLatestRankingsVersions()

  const { draftId, draftDateTime } = await createDraft(draftConfig, draftOrder, latestRankingsVersions)
  addDraftToUserDrafts(userId, draftId, draftDateTime, draftConfig.draftName)
  return {
    draftId,
    rankingsVersions: latestRankingsVersions
  }
}

const createDraftOrder = (userId: string, numDrafters: number, ownerDraftPosition: number): DraftOrder => {
  return Array(numDrafters).fill(null).reduce((acc, _, ind) => {
    return {
      ...acc,
      [ind + 1]: ind + 1 === ownerDraftPosition ? userId : 'CPU'
    }
  }, {})
}