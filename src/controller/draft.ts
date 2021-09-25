import { Request, Response, Router } from 'express'
import { createDraftExecutor } from '../executor/createDraft'
import { deleteDraftPickExecutor } from '../executor/deleteDraftPick'
import { draftPlayerExecutor } from '../executor/draftPlayer'
import { getDraftExecutor } from '../executor/getDraft'
import { getDraftsExecutor } from '../executor/getDrafts'
import { joinDraftExecutor } from '../executor/joinDraft'
import { CreateDraftRequest, DeleteDraftPickRequest, DraftPlayerRequest, JoinDraftRequest } from '../model/draft'

export const draftRouter = Router()

draftRouter.get('/', async (req: Request, res: Response) => {
  const userId = req.headers['user-id'] as string
  const response = await getDraftsExecutor(userId)
  res.send(response)
})

draftRouter.post('/', async (req: Request, res: Response) => {
  const userId = req.headers['user-id'] as string
  const { draftConfig, ownerDraftPosition } = req.body as CreateDraftRequest
  const draftId = await createDraftExecutor(userId, draftConfig, ownerDraftPosition)
  res.status(201).send(draftId)
})

draftRouter.get('/:draftId', async (req: Request, res: Response) => {
  const { draftId } = req.params
  const response = await getDraftExecutor(draftId)
  res.send(response)
})

draftRouter.post('/:draftId/drafters', async (req: Request, res: Response) => {
  const userId = req.headers['user-id'] as string
  const { draftId } = req.params
  const { draftPosition } = req.body as JoinDraftRequest
  const response = await joinDraftExecutor(userId, draftId, draftPosition)
  res.send(response)
})

draftRouter.post('/:draftId/picks', async (req: Request, res: Response) => {
  const { pickNumber, playerId } = req.body as DraftPlayerRequest
  const { draftId } = req.params
  await draftPlayerExecutor(draftId, playerId, pickNumber)
  res.status(201).send()
})

draftRouter.delete('/:draftId/picks/:pickNumber', async (req: Request, res: Response) => {
  const { draftId, pickNumber } = req.params
  await deleteDraftPickExecutor(draftId, +pickNumber)
  res.send()
})