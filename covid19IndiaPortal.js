
// # Covid-19 India Portal

// Given two files `app.js` and a database file `covid19IndiaPortal.db` consisting of three tables `state`, `district` and `user`.

// Write APIs to perform operations on the tables `state`, `district` only after authentication of the user.

// The columns of the tables are given below,

// **State Table**

// | Columns    | Type    |
// | ---------- | ------- |
// | state_id   | INTEGER |
// | state_name | TEXT    |
// | population | INTEGER |

// **District Table**

// | Columns       | Type    |
// | ------------- | ------- |
// | district_id   | INTEGER |
// | district_name | TEXT    |
// | state_id      | INTEGER |
// | cases         | INTEGER |
// | cured         | INTEGER |
// | active        | INTEGER |
// | deaths        | INTEGER |

// You can use your previous code if required.

// #### Sample Valid User Credentials

// ```
// {
//   "username": "christopher_phillips",
//   "password": "christy@123"
// }
// ```

// ### API 1

// #### Path: `/login/`

// #### Method: `POST`

// **Request**

// ```
// {
//   "username": "christopher_phillips",
//   "password": "christy@123"
// }
// ```

// - **Scenario 1**

//   - **Description**:

//     If an unregistered user tries to login

//   - **Response**
//     - **Status code**
//       ```
//       400
//       ```
//     - **Body**
//       ```
//       Invalid user
//       ```

// - **Scenario 2**

//   - **Description**:

//     If the user provides an incorrect password

//   - **Response**
//     - **Status code**
//       ```
//       400
//       ```
//     - **Body**
//       ```
//       Invalid password
//       ```

// - **Scenario 3**

//   - **Description**:

//     Successful login of the user

//   - **Response**

//     Return the JWT Token

//     ```
//     {
//       "jwtToken": "ak2284ns8Di32......"
//     }
//     ```

// ### Authentication with Token

// - **Scenario 1**

//   - **Description**:

//     If the token is not provided by the user or an invalid token

//   - **Response**
//     - **Status code**
//       ```
//       401
//       ```
//     - **Body**
//       ```
//       Invalid JWT Token
//       ```

// - **Scenario 2**
//   After successful verification of token proceed to next middleware or handler

// ### API 2

// #### Path: `/states/`

// #### Method: `GET`

// #### Description:

// Returns a list of all states in the state table

// #### Response

// ```
// [
//   {
//     "stateId": 1,
//     "stateName": "Andaman and Nicobar Islands",
//     "population": 380581
//   },

//   ...
// ]
// ```

// ### API 3

// #### Path: `/states/:stateId/`

// #### Method: `GET`

// #### Description:

// Returns a state based on the state ID

// #### Response

// ```
// {
//   "stateId": 8,
//   "stateName": "Delhi",
//   "population": 16787941
// }
// ```

// ### API 4

// #### Path: `/districts/`

// #### Method: `POST`

// #### Description:

// Create a district in the district table, `district_id` is auto-incremented

// #### Request

// ```
// {
//   "districtName": "Bagalkot",
//   "stateId": 3,
//   "cases": 2323,
//   "cured": 2000,
//   "active": 315,
//   "deaths": 8
// }
// ```

// #### Response

// ```
// District Successfully Added
// ```

// ### API 5

// #### Path: `/districts/:districtId/`

// #### Method: `GET`

// #### Description:

// Returns a district based on the district ID

// #### Response

// ```
// {
//   "districtId": 322,
//   "districtName": "Palakkad",
//   "stateId": 17,
//   "cases": 61558,
//   "cured": 59276,
//   "active": 2095,
//   "deaths": 177
// }
// ```

// ### API 6

// #### Path: `/districts/:districtId/`

// #### Method: `DELETE`

// #### Description:

// Deletes a district from the district table based on the district ID

// #### Response

// ```
// District Removed

// ```

// ### API 7

// #### Path: `/districts/:districtId/`

// #### Method: `PUT`

// #### Description:

// Updates the details of a specific district based on the district ID

// #### Request

// ```
// {
//   "districtName": "Nadia",
//   "stateId": 3,
//   "cases": 9628,
//   "cured": 6524,
//   "active": 3000,
//   "deaths": 104
// }
// ```

// #### Response

// ```

// District Details Updated

// ```

// ### API 8

// #### Path: `/states/:stateId/stats/`

// #### Method: `GET`

// #### Description:

// Returns the statistics of total cases, cured, active, deaths of a specific state based on state ID

// #### Response

// ```
// {
//   "totalCases": 724355,
//   "totalCured": 615324,
//   "totalActive": 99254,
//   "totalDeaths": 9777
// }

// ```

// <br/>

// Use `npm install` to install the packages.

// **Export the express instance using the default export syntax.**

// **Use Common JS module syntax.**


const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const path = require('path')
app.use(express.json())

const dbPath = path.join(__dirname, 'covid19IndiaPortal.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

//login API
app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const selectUserQuery = `SELECT * FROM user WHERE username = ?`
  const dbUser = await db.get(selectUserQuery, [username])
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      }
      const jwtToken = jwt.sign(payload, 'SECRET_TOKEN')
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

//get states API
app.get('/states/', authenticateToken, async (request, response) => {
  const getStatesQuery = `SELECT state_id AS stateId, state_name AS stateName, population FROM state ORDER BY state_id`
  const statesArray = await db.all(getStatesQuery)
  response.send(statesArray)
})

//get state API
app.get('/states/:stateId/', authenticateToken, async (request, response) => {
  const {stateId} = request.params
  const getStateQuery = `SELECT state_id AS stateId, state_name AS stateName, population FROM state WHERE state_id = ${stateId}`
  const state = await db.get(getStateQuery)
  response.send(state)
})

//create district API
app.post('/districts/', authenticateToken, async (request, response) => {
  const {districtName, stateId, cases, cured, active, deaths} = request.body
  const createDistrictQuery = `INSERT INTO district(district_name, state_id, cases,cured,active,deaths) VALUES(?,?,?,?,?,?)`
  await db.run(createDistrictQuery, [
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  ])
  response.send('District Successfully Added')
})

//get district API
app.get(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const getDistrictQuery = `SELECT district_id AS districtId, district_name AS districtName, state_id AS stateId, cases, cured, active, deaths FROM district WHERE district_id = ${districtId}`
    const district = await db.get(getDistrictQuery)
    response.send(district)
  },
)

//delete district API
app.delete(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const deleteDistrictQuery = `DELETE FROM district WHERE district_id = ${districtId}`
    await db.run(deleteDistrictQuery)
    response.send('District Removed')
  },
)

//update district API
app.put(
  '/districts/:districtId/',
  authenticateToken,
  async (request, response) => {
    const {districtId} = request.params
    const {districtName, stateId, cases, cured, active, deaths} = request.body
    const updateDistrictQuery = `UPDATE district SET district_name = ?, state_id = ?, cases = ?, cured = ?, active = ?, deaths = ? WHERE district_id = ?`
    await db.run(updateDistrictQuery, [
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
      districtId,
    ])
    response.send('District Details Updated')
  },
)

//get statistics API
app.get(
  '/states/:stateId/stats/',
  authenticateToken,
  async (request, response) => {
    const {stateId} = request.params
    const getStatsQuery = `SELECT SUM(cases) AS totalCases, SUM(cured) AS totalCured, SUM(active) AS totalActive, SUM(deaths) AS totalDeaths FROM district WHERE state_id = ${stateId}`
    const stats = await db.get(getStatsQuery)
    response.send(stats)
  },
)

module.exports = app
