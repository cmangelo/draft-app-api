export type Player = {
  name: string
  team: string
  bye: number
  rank: number
  points: number
  risk: number
  adp: string
  tier: number
  notes: string
}

export type RankingsVersions = {
  QB: number
  RB: number
  WR: number
  TE: number
  FLEX: number
}