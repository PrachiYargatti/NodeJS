const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express() //server started or instantiated
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//GET players API
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT player_id AS playerId, player_name AS playerName, jersey_number AS jerseyNumber, role FROM cricket_team`
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//POST player API
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const postPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role) VALUES(?,?,?)`

  await db.run(postPlayerQuery, [playerName, jerseyNumber, role])
  response.send('Player Added to Team')
})

//GET player API
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT player_id AS playerId, player_name AS playerName, jersey_number AS jerseyNumber, role FROM cricket_team WHERE player_id = ?`
  const player = await db.get(getPlayerQuery, [parseInt(playerId)])
  response.send(player)
})

//update player API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `UPDATE cricket_team SET player_name = ?, jersey_number = ?, role = ? WHERE player_id = ?`
  await db.run(updatePlayerQuery, [playerName, jerseyNumber, role, playerId])
  response.send('Player Details Updated')
})

//delete player API
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ?`
  await db.run(deletePlayerQuery, [playerId])
  response.send('Player Removed')
})

module.exports = app
