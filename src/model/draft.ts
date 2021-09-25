import { RankItem } from "../db/models/RanksItem"
import { RankingsVersions } from "./player"

export type PlayerCount = {
  quarterback: number
  runningback: number
  wideReceiver: number
  tightEnd: number
  flex: number
  superflex: number
  defense: number
  kicker: number
  bench: number
}

export type CreateDraftRequest = {
  draftConfig: DraftConfig
  ownerDraftPosition: number
}

export type CreateDraftResponse = {
  draftId: string
  rankingsVersions: RankingsVersions
}

export interface DraftConfig {
  numDrafters: number
  playerCount: PlayerCount
  draftName?: string
  owner?: string
}

export type DraftPlayerRequest = {
  playerId: string
  pickNumber: number
}

export type DeleteDraftPickRequest = {
  pickNumber: number
}

export type JoinDraftRequest = {
  draftPosition: number
}

export type DraftOrder = {
  [draftPos: number]: string
}

export type DraftPicks = {
  [pickNum: number]: string
}

export type GetDraftResponse = {
  picks: DraftPicks
  rankingsVersions: RankingsVersions
  config: DraftConfig
  draftOrder: DraftOrder
}

export type UserDraft = {
  draftId: string
  draftDateTime: string
  draftName: string
}

export type UpdateRanksRequest = {
  ranks: Array<RankItem>
}