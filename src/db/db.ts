import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { 
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand, 
  PutCommandInput, 
  QueryCommand,
  QueryCommandInput, 
  UpdateCommand, 
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { v4 as uuid } from 'uuid'
import { DraftConfig, DraftOrder, GetDraftResponse, UserDraft } from '../model/draft'
import { Player, RankingsVersions, SosRanks } from '../model/player'
import { DraftConfigItem } from './models/DraftConfigItem'
import { DraftPicksItem } from './models/DraftPicksItem'
import { LatestRankingsVersionsItem } from './models/LatestRankingsVersionsItem'
import { PlayerItem, PlayersItem } from './models/PlayerItem'
import { RankItem, RanksItem } from './models/RanksItem'
import { SosRanksItem } from './models/SosRanksItem'

const client = new DynamoDBClient({ region: 'us-east-1' })
const docClient = DynamoDBDocumentClient.from(client)

const TableName = 'DraftsTable'
const DRAFT_PREFIX = 'DRAFT'
const USER_PREFIX = 'USER'
const CONFIG = 'CONFIG'
const PICKS = 'PICKS'
const RANKS = 'RANKS'
const DRAFTS = 'DRAFTS'
const PLAYERS = 'PLAYERS'
const LATEST_VERSIONS = 'LATEST_VERSIONS'
const STRENGTH_OF_SCHEDULE = 'SOS'
const EARLY = 'EARLY'
const PLAYOFFS = 'PLAYOFFS'
const FULL = 'FULL'

const buildDraftPK = (draftId: string) => `${DRAFT_PREFIX}#${draftId}`
const buildUserPK = (userId: string) => `${USER_PREFIX}#${userId}`
const buildUserDraftsPK = (userId: string) => `${buildUserPK(userId)}#${DRAFTS}`
const buildUserRanksPk = (userId: string) => `${buildUserPK(userId)}#${RANKS}`

export const getDrafts = async (userId: string): Promise<Array<UserDraft>> => {
  const userPK = buildUserDraftsPK(userId)
  const params: QueryCommandInput = {
    TableName,
    KeyConditionExpression: `PK = :userPK`,
    ExpressionAttributeValues: {
      ':userPK': userPK
    },
    ProjectionExpression: 'draftId, draftName, draftDateTime'
  }
  const command = new QueryCommand(params)
  const res = await docClient.send(command)
  return res.Items as Array<UserDraft>
}

export const getDraft = async (draftId: string): Promise<GetDraftResponse> => {
  const draftPK = buildDraftPK(draftId)
  const params: QueryCommandInput = {
    TableName,
    KeyConditionExpression: `PK = :draftPK`,
    ExpressionAttributeValues: {
      ':draftPK': draftPK
    }
  }
  const command = new QueryCommand(params)
  const res = await docClient.send(command)

  const config = res.Items?.find(item => item.SK === CONFIG) as DraftConfigItem
  const picks = res.Items?.find(item => item.SK === PICKS) as DraftPicksItem
  return {
    picks: picks?.picks,
    config: config?.config,
    rankingsVersions: config?.rankingsVersions,
    draftOrder: config?.draftOrder
  }
}

export const createDraft = async (config: DraftConfig, draftOrder: DraftOrder, rankingsVersions: RankingsVersions ) => {
  const draftId = uuid()
  const draftPK = buildDraftPK(draftId)
  const draftDateTime = new Date().toISOString()

  const putConfigInput: PutCommandInput = {
    TableName,
    Item: {
      PK: draftPK,
      SK: CONFIG,
      config,
      draftOrder,
      draftDateTime,
      rankingsVersions
    }
  }
  const putPlayersInput: PutCommandInput = {
    TableName,
    Item: {
      PK: draftPK,
      SK: PICKS,
      picks: {}
    }
  }

  await docClient.send(new PutCommand(putConfigInput))
  await docClient.send(new PutCommand(putPlayersInput))
  return { draftId , draftDateTime }
}

export const addDraftToUserDrafts = async (
  userId: string, 
  draftId: string, 
  draftDateTime: string,
  draftName: string
) => {
  const userPK = buildUserDraftsPK(userId)

  const input: PutCommandInput = {
    TableName,
    Item: {
      PK: userPK,
      SK: draftDateTime,
      draftId,
      draftName,
      draftDateTime
    }
  }

  await docClient.send(new PutCommand(input))
}

export const joinDraft = async (
  userId: string,
  draftId: string,
  draftPosition: number
) => {
  const draftPK = buildDraftPK(draftId)

  const input: UpdateCommandInput = {
    TableName,
    Key: {
      PK: draftPK,
      SK: CONFIG
    },
    UpdateExpression: 'SET draftOrder.#orderNumber = :userId',
    ExpressionAttributeNames: { '#orderNumber': `${draftPosition}` },
    ExpressionAttributeValues: { ':userId': userId },
    ConditionExpression: 'attribute_exists(draftOrder.#orderNumber)'
  }

  await docClient.send(new UpdateCommand(input))
}

export const draftPlayer = async (draftId: string, playerId: string, pickNumber: number) => {
  const draftPK = buildDraftPK(draftId)

  const input: UpdateCommandInput = {
    TableName,
    Key: {
      PK: draftPK,
      SK: PICKS
    },
    UpdateExpression: 'SET picks.#pickNumber = :playerId',
    ExpressionAttributeNames: { '#pickNumber' :  `${pickNumber}` },
    ExpressionAttributeValues: { ':playerId' : playerId },
  }

  await docClient.send(new UpdateCommand(input))
}

export const deleteDraftPick = async (draftId: string, pickNumber: number) => {
  const draftPK = buildDraftPK(draftId)

  const input: UpdateCommandInput = {
    TableName,
    Key: {
      PK: draftPK,
      SK: PICKS
    },
    UpdateExpression: 'REMOVE picks.#pickNumber',
    ExpressionAttributeNames: { '#pickNumber' :  `${pickNumber}` },
  }

  await docClient.send(new UpdateCommand(input))
}

export const getLatestRankingsVersions = async (): Promise<RankingsVersions> => {
  const input: GetCommandInput = {
    TableName,
    Key: {
      PK: RANKS,
      SK: LATEST_VERSIONS
    },
    ProjectionExpression: 'versions'
  }

  const res = await docClient.send(new GetCommand(input))
  const item = res.Item as LatestRankingsVersionsItem
  return item.versions
}

export const getLatestPlayerVersion = async (): Promise<RankingsVersions> => {
  const input: GetCommandInput = {
    TableName,
    Key: {
      PK: PLAYERS,
      SK: LATEST_VERSIONS
    },
    ProjectionExpression: 'versions'
  }

  const res = await docClient.send(new GetCommand(input))
  const item = res.Item as LatestRankingsVersionsItem
  return item.versions
}

export const getRanks = async (position: string, version: number): Promise<Array<RankItem>> => {
  const input: GetCommandInput = {
    TableName,
    Key: {
      PK: RANKS,
      SK: `${position}#${version}`
    },
    ProjectionExpression: 'ranks'
  }

  const res = await docClient.send(new GetCommand(input))
  const item = res.Item as RanksItem
  return item.ranks
}

export const getUserRanks = async (userId: string, position: string): Promise<Array<RankItem>> => {
  const input: GetCommandInput = {
    TableName,
    Key: {
      PK: buildUserRanksPk(userId),
      SK: position
    },
    ProjectionExpression: 'ranks'
  }

  const res = await docClient.send(new GetCommand(input))
  const item = res.Item as RanksItem
  return item.ranks
}

export const updateUserRanks = async (
  userId: string, 
  position: string,
  ranks: RankItem[]
): Promise<void> => {
  const input: UpdateCommandInput = {
    TableName,
    Key: {
      PK: buildUserRanksPk(userId),
      SK: position
    },
    UpdateExpression: 'SET ranks = :ranks',
    ExpressionAttributeValues: { ':ranks': ranks }
  }

  await docClient.send(new UpdateCommand(input))
}

export const getPlayers = async (position: string, version: number): Promise<Array<PlayerItem>> => {
  const input: GetCommandInput = {
    TableName,
    Key: {
      PK: PLAYERS,
      SK: `${position}#${version}`
    },
    ProjectionExpression: 'players'
  }

  const res = await docClient.send(new GetCommand(input))
  const item = res.Item as PlayersItem
  return item.players
}

export const getStrengthOfSchedule = async (): Promise<SosRanks> => {
  const params: QueryCommandInput = {
    TableName,
    KeyConditionExpression: `PK = :sos`,
    ExpressionAttributeValues: {
      ':sos': STRENGTH_OF_SCHEDULE
    }
  }
  const command = new QueryCommand(params)
  const res = await docClient.send(command)

  const earlySos = res.Items?.find(item => item.SK === EARLY) as SosRanksItem
  const playoffSos = res.Items?.find(item => item.SK === PLAYOFFS) as SosRanksItem
  const fullSos = res.Items?.find(item => item.SK === FULL) as SosRanksItem

  return {
    earlySos: earlySos.ranks,
    playoffSos: playoffSos.ranks,
    fullSos: fullSos.ranks
  }
}