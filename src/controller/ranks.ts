import { Request, Response, Router } from 'express'
import { getRanksExecutor } from '../executor/getRanks'
import { updateRanksExecutor } from '../executor/updateRanks'
import { UpdateRanksRequest } from '../model/draft'
import { RankingsVersions } from '../model/player'

export const ranksRouter = Router()

ranksRouter.get('/positions/:position', async (req: Request, res: Response) => {
  const userId = req.headers['user-id'] as string
  const { version } = req.query 
  const { position } = req.params
  const ranks = await getRanksExecutor(
    userId, 
    position.toUpperCase() as keyof RankingsVersions, 
    version as string | undefined
  )
  res.send(ranks)
})

ranksRouter.put('/positions/:position', async (req: Request, res: Response) => {
  const userId = req.headers['user-id'] as string
  const { ranks } = req.body as UpdateRanksRequest
  const { position } = req.params

  await updateRanksExecutor(userId, position, ranks)
  res.status(204).send()
})