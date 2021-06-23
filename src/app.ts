import express from "express"

const app = express()

const PORT = 3000

app.get('/test', (req: any, res: any) => res.send('hiya'));

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
})