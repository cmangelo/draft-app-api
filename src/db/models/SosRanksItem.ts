import { TableItem } from './TableItem'

export type SosPositionRanks = {
  qb: string
  rb: string
  wr: string
  te: string
  k: string
  def: string
}

export type SosTeamRanks = {
  [team: string]: SosPositionRanks
}

export interface SosRanksItem extends TableItem {
  ranks: SosTeamRanks
}