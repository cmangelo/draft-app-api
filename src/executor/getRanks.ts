import { 
  getLatestPlayerVersion, 
  getLatestRankingsVersions, 
  getPlayers, 
  getRanks, 
  getStrengthOfSchedule, 
  getUserRanks as getUserRanksDb, 
  updateUserRanks} from '../db/db'
import { PlayerItem } from '../db/models/PlayerItem'
import { RankItem } from '../db/models/RanksItem'
import { SosPositionRanks } from '../db/models/SosRanksItem'
import { Player, RankingsVersions } from '../model/player'

export const getRanksExecutor = async (
  userId: string,
  position: keyof RankingsVersions, 
  version?: string
): Promise<Player[]> => {
  let ranks: RankItem[]
  let players: PlayerItem[]
  if (version === 'USER') {
    const res = await getUserRanks(userId, position)
    ranks = res.ranks
    players = res.players
  } else if (version !== undefined) {
    const versionNumber = parseInt(version as string)
    ranks = await getRanks(position, versionNumber) 
    players = await getPlayers(position, versionNumber)
  } else {
    const latestRankingsVersions = await getLatestRankingsVersions()
    ranks = await getRanks(position, latestRankingsVersions[position] as number)
    players = await getPlayers(position, latestRankingsVersions[position] as number)
  }

  const sosRanks = await getStrengthOfSchedule()

  const keyedRanks = ranks.reduce((acc, rank) => {
    acc[rank.key] = rank
    return acc
  }, {} as { [key: string]: RankItem })

  return players.map(player => ({
    ...player,
    ...keyedRanks[player.key],
    bye: parseInt(player.bye as string),
    rank: parseInt(keyedRanks[player.key].rank as string),
    points: parseFloat(player.points as string),
    tier: parseInt(keyedRanks[player.key].tier as string),
    earlySos: parseInt(sosRanks.earlySos[player.team][player.position as keyof SosPositionRanks] as string),
    fullSos: parseInt(sosRanks.fullSos[player.team][player.position as keyof SosPositionRanks] as string),
    playoffSos: parseInt(sosRanks.playoffSos[player.team][player.position as keyof SosPositionRanks] as string)
  }))
}

const getUserRanks = async (
  userId: string,
  position: keyof RankingsVersions
) => {
  let ranks: RankItem[]
  try {
    ranks = await getUserRanksDb(userId, position)
  } catch (e) {
    const latestRankingsVersions = await getLatestRankingsVersions()
    ranks = await getRanks(position, latestRankingsVersions[position] as number)
    await updateUserRanks(userId, position, ranks)
  }

  const latestPlayerVersions = await getLatestPlayerVersion()
  const players = await getPlayers(position, latestPlayerVersions[position] as number)

  return { ranks, players }
}