import { joinDraft } from "../db/db"

export const joinDraftExecutor = async (userId: string, draftId: string, draftPosition: number) => {
  await joinDraft(userId, draftId, draftPosition)
}