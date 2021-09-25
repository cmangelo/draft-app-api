import express, { Request } from 'express'
import { draftRouter } from './controller/draft';
import { ranksRouter } from './controller/ranks';
import { readFile } from './util/readSosFile';

const app = express()
app.use(express.json())

const PORT = 8080

app.get('/test', (req: Request, res: any) => {
  console.log(req.headers)
  res.send('hiya')
});

app.use('/drafts', draftRouter)
app.use('/ranks', ranksRouter)

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
})

// readFile()