
// # Player Match Scores

// Given two files `app.js` and a database file `cricketMatchDetails.db` consisting of three tables `player_details`, `match_details` and `player_match_score`.

// Write APIs to perform operations on the tables `player_details`, `match_details` and `player_match_score` containing the following columns,

// **Player Details Table**

// | Column    | Type    |
// | ---------- | ------- |
// | player_id   | INTEGER |
// | player_name | TEXT    |

// **Match Details Table**

// | Column    | Type    |
// | ---------- | ------- |
// | match_id   | INTEGER |
// | match | TEXT    |
// |year|INTEGER|

// **Player Match Score Table**

// | Column    | Type    |
// | ---------- | ------- |
// | player_match_id   | INTEGER |
// | player_id | INTEGER    |
// |match_id|INTEGER|
// |score|INTEGER|
// |fours | INTEGER |
// |sixes | INTEGER |

// ### API 1

// #### Path: `/players/`

// #### Method: `GET`

// #### Description:

// Returns a list of all the players in the player table

// #### Response

// ```
// [
//   { 
//     playerId: 1,
//     playerName: "Ram"
//   },

//   ...
// ]
// ```

// ### API 2

// #### Path: `/players/:playerId/`

// #### Method: `GET`

// #### Description:

// Returns a specific player based on the player ID

// #### Response

// ```
// { 
//   playerId: 2,
//   playerName: "Joseph"
// }
// ```

// ### API 3

// #### Path: `/players/:playerId/`

// #### Method: `PUT`

// #### Description:

// Updates the details of a specific player based on the player ID

// #### Request

// ```
// {
//   "playerName": "Raju"
// }
// ```

// #### Response

// ```
// Player Details Updated
// ```



// ### API 4

// #### Path: `/matches/:matchId/`

// #### Method: `GET`

// #### Description:

// Returns the match details of a specific match

// #### Response

// ```
// { 
//   matchId: 18,
//   match: "RR vs SRH",
//   year: 2011
// }
// ```

// ### API 5

// #### Path: `/players/:playerId/matches`

// #### Method: `GET`

// #### Description:

// Returns a list of all the matches of a player

// #### Response

// ```
// [
//   { 
//     matchId: 1,
//     match: "SRH vs MI",
//     year: 2016
//   },

//   ...
// ]
// ```


// ### API 6

// #### Path: `/matches/:matchId/players`

// #### Method: `GET`

// #### Description:

// Returns a list of players of a specific match

// #### Response

// ```
// [
//   { 
//     playerId: 2,
//     playerName: "Joseph"
//   },
//   ...
// ]
// ```



// ### API 7

// #### Path: `/players/:playerId/playerScores`

// #### Method: `GET`

// #### Description:

// Returns the statistics of the total score, fours, sixes of a specific player based on the player ID

// #### Response

// ```
// {
//   playerId: 1,
//   playerName: "Ram"
//   totalScore: 3453,
//   totalFours: 342,
//   totalSixes: 98
// }

// ```

// <br/>

// Use `npm install` to install the packages.

// **Export the express instance using the default export syntax.**

// **Use Common JS module syntax.**


const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const path = require('path')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketMatchDetails.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//get players API
app.get('/players/', async (request, response) => {
  const getPlayersQuery = `SELECT player_id AS playerId, player_name AS playerName FROM player_details`
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//get player API
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `SELECT player_id AS playerId, player_name AS playerName FROM player_details WHERE player_id = ?`
  const player = await db.get(getPlayerQuery, [playerId])
  response.send(player)
})

//update player API
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const requestDetails = request.body
  const {playerName} = requestDetails
  const updatePlayerQuery = `UPDATE player_details SET player_name = ? WHERE player_id = ?`
  await db.run(updatePlayerQuery, [playerName, playerId])
  response.send('Player Details Updated')
})

//get match API
app.get('/matches/:matchId/', async (request, response) => {
  const {matchId} = request.params
  const getMatchQuery = `SELECT match_id AS matchId, match, year FROM match_details WHERE match_id = ?`
  const match = await db.get(getMatchQuery, [matchId])
  response.send(match)
})

//get a list of all the matches of a player
app.get('/players/:playerId/matches', async (request, response) => {
  const {playerId} = request.params
  const getMatchQuery = `SELECT m.match_id AS matchId, m.match, m.year 
                        FROM match_details m
                        INNER JOIN player_match_score pm
                        ON m.match_id = pm.match_id
                        WHERE pm.player_id = ?`
  const match = await db.all(getMatchQuery, [playerId])
  response.send(match)
})

//get a list of players of a specific match
app.get('/matches/:matchId/players', async (request, response) => {
  const {matchId} = request.params
  const getPlayerQuery = `SELECT p.player_id AS playerId, p.player_name AS playerName
                          FROM player_details p
                          INNER JOIN player_match_score pm
                          ON p.player_id = pm.player_id
                          WHERE pm.match_id = ?`
  const player = await db.all(getPlayerQuery, [matchId])
  response.send(player)
})

//get statistics of the total score, fours, sixes of a specific player based on the player ID
app.get('/players/:playerId/playerScores', async (request, response) => {
  const {playerId} = request.params
  const getStatsQuery = `SELECT p.player_id AS playerId, p.player_name AS playerName, SUM(pm.score) AS totalScore, SUM(pm.fours) AS totalFours, SUM(pm.sixes) AS totalSixes
                        FROM player_details p
                        INNER JOIN player_match_score pm
                        ON p.player_id = pm.player_id
                        WHERE pm.player_id = ?`
  const stats = await db.get(getStatsQuery, [playerId])
  response.send(stats)
})

module.exports = app
