import { TableItem } from './TableItem'

export type RankItem = {
  key: string
  position: string
  rank: number | string
  tier: number | string
}

export interface RanksItem extends TableItem {
  ranks: Array<RankItem>
}