import express, { Request } from "express"

const app = express()

const PORT = 8080

app.get('/test', (req: Request, res: any) => {
  console.log(req.headers)
  res.send('hiya')
});

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
})