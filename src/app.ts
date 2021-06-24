import express from "express"

const app = express()

const PORT = 8080

app.get('/test', (req: any, res: any) => {
  console.log(req)
  res.send('hiya')
});

app.listen(PORT, () => {
  console.log('listening on port ' + PORT)
})