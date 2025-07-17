const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'covid19India.db')
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
    console.log(`DB error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//get states API
app.get('/states/', async (request, response) => {
  const getStatesQuery = `SELECT * FROM state`
  const statesArray = await db.all(getStatesQuery)
  const camelCaseArray = statesArray.map(each => ({
    stateId: each.state_id,
    stateName: each.state_name,
    population: each.population,
  }))
  response.send(camelCaseArray)
})

//get state API
app.get('/states/:stateId/', async (request, response) => {
  const {stateId} = request.params
  const getStateQuery = `SELECT * FROM state WHERE state_id = ?`
  const state = await db.get(getStateQuery, [stateId])

  if (state == undefined) {
    response.status(404).send({error: 'State not found'})
  } else {
    const dbResponse = {
      stateId: state.state_id,
      stateName: state.state_name,
      population: state.population,
    }
    response.send(dbResponse)
  }
})

//create district API
app.post('/districts/', async (request, response) => {
  const districtDetail = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtDetail
  const addDistrictQuery = `INSERT INTO district(district_name, state_id, cases, cured, active, deaths) VALUES(?,?,?,?,?,?)`
  await db.run(addDistrictQuery, [
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
app.get('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const getDistrictQuery = `SELECT * FROM district WHERE district_id = ?`
  const district = await db.get(getDistrictQuery, [districtId])

  if (district == undefined) {
    response.status(404).send({error: 'District not found'})
  } else {
    const dbResponse = {
      districtId: district.district_id,
      districtName: district.district_name,
      stateId: district.state_id,
      cases: district.cases,
      cured: district.cured,
      active: district.active,
      deaths: district.deaths,
    }
    response.send(dbResponse)
  }
})

//delete district API
app.delete('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const deleteDistrictQuery = `DELETE FROM district WHERE district_id = ?`
  await db.run(deleteDistrictQuery, [districtId])
  response.send('District Removed')
})

//update district API
app.put('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const districtDetail = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtDetail
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
})

//get statistics of total cases, cured, active, deaths of a specific state based on state ID API
app.get('/states/:stateId/stats/', async (request, response) => {
  const {stateId} = request.params
  const getStatsQuery = `SELECT SUM(cases) AS totalCases, SUM(cured) AS totalCured, SUM(active) AS totalActive, SUM(deaths) AS totalDeaths FROM district WHERE state_id = ?`
  const stats = await db.get(getStatsQuery, [stateId])
  if (stats == undefined) {
    response.status(404).send({error: 'state not found'})
  } else {
    const dbResponse = {
      totalCases: stats.totalCases,
      totalCured: stats.totalCured,
      totalActive: stats.totalActive,
      totalDeaths: stats.totalDeaths,
    }
    response.send(dbResponse)
  }
})

//get an object containing the state name of a district based on the district ID API
app.get('/districts/:districtId/details/', async (request, response) => {
  const {districtId} = request.params
  const getStateNameQuery = `SELECT s.state_name FROM state s INNER JOIN district d ON s.state_id = d.state_id WHERE district_id = ?`
  const statename = await db.get(getStateNameQuery, [districtId])
  if (statename == undefined) {
    response.status(404).send({error: 'state not found'})
  } else {
    const dbResponse = {
      stateName: statename.state_name,
    }
    response.send(dbResponse)
  }
})

module.exports = app
