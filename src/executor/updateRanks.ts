import { updateUserRanks } from "../db/db";
import { RankItem, RanksItem } from "../db/models/RanksItem";

export const updateRanksExecutor = async (
  userId: string,
  position: string,
  ranks: RankItem[]
) => {
  await updateUserRanks(userId, position, ranks)
}