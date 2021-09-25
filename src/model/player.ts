import { SosRanksItem, SosTeamRanks } from '../db/models/SosRanksItem'

// Using union types for some of the values because they come back as strings from 
// DynamoDB and then we cast them to the correct type.
export type Player = {
  key: string
  name: string
  team: string
  bye: number | string
  rank: number | string
  points: number | string
  risk: string
  adp: string
  tier: number | string
  notes: string
  position: string
  earlySos: number
  playoffSos: number
  fullSos: number
}

export type RankingsVersions = {
  QB: number | 'USER'
  RB: number | 'USER'
  WR: number | 'USER'
  TE: number | 'USER'
  FLEX: number | 'USER'
}

export type SosRanks = {
  earlySos: SosTeamRanks
  playoffSos: SosTeamRanks
  fullSos: SosTeamRanks
}