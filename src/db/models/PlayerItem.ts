import { TableItem } from './TableItem'

export type PlayerItem = {
  key: string
  name: string
  team: string
  bye: number | string
  points: number | string
  risk: string
  adp: string
  notes: string
  position: string
}

export interface PlayersItem extends TableItem {
  players: Array<PlayerItem>
}