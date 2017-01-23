const express = require('express')
const { MongoClient } = require('mongodb')

const mongoUrl = 'mongodb://localhost:27017/tutorial-app'
MongoClient.connect(mongoUrl, (err, db) => {
  if (err) {
    console.log('Failed to connect to MongoDB')
    throw err
  }

  const app = express()
  const logs = db.collection('logs')

  app.use(express.static('public'))

  app.get('/log.js', (req, res) => {
    logs.insertOne({
      ts: Date.now(),
      ua: req.headers['user-agent'],
      referer: req.headers['referer'],
      ip: getIp(req)
    }, (err) => {
      if (err) {
        console.log('Failed to create log')
        throw err
      }
      res.send(`console.log('You got tracked')`)
    })
  })
  app.listen(3000, () => {
    console.log('Server running on port 3000')
  })
})

function getIp (req) {
  return req.headers['x-real-ip'] ||
    req.connection.remoteAddress
}
