const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//get movie names API
app.get('/movies/', async (request, response) => {
  const getAllMovieNamesQuery = `SELECT movie_name FROM movie`
  const movieNameArray = await db.all(getAllMovieNamesQuery)
  const camelCaseArray = movieNameArray.map(each => ({
    movieName: each.movie_name,
  }))
  response.send(camelCaseArray)
})

//post movie API
app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `INSERT INTO movie(director_id,movie_name,lead_actor) VALUES(?,?,?)`
  await db.run(addMovieQuery, [directorId, movieName, leadActor])
  response.send('Movie Successfully Added')
})

//get movie API
app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `SELECT * FROM movie WHERE movie_id = ?`
  const dbMovie = await db.get(getMovieQuery, [movieId])

  if (dbMovie === undefined) {
    response.status(404).send({error: 'Movie not found'})
  } else {
    const movie = {
      movieId: dbMovie.movie_id,
      directorId: dbMovie.director_id,
      movieName: dbMovie.movie_name,
      leadActor: dbMovie.lead_actor,
    }

    response.send(movie)
  }
})

//update movie API
app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `UPDATE movie SET director_id = ?,movie_name = ?,lead_actor = ? WHERE movie_id = ?`
  await db.run(addMovieQuery, [directorId, movieName, leadActor, movieId])
  response.send('Movie Details Updated')
})

//delete movie API
app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ?`
  await db.run(deleteMovieQuery, [movieId])
  response.send('Movie Removed')
})

//get directors API
app.get('/directors/', async (request, response) => {
  const getAllDirectorsQuery = `SELECT * FROM director`
  const directorsArray = await db.all(getAllDirectorsQuery)
  const camelCaseDirectors = directorsArray.map(each => ({
    directorId: each.director_id,
    directorName: each.director_name,
  }))
  response.send(camelCaseDirectors)
})

//get movie names directed by specific directors API
app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getAllMovieNamesQuery = `SELECT movie_name FROM movie WHERE director_id = ?`
  const movieNameArray = await db.all(getAllMovieNamesQuery, [directorId])
  const camelCaseArray = movieNameArray.map(each => ({
    movieName: each.movie_name,
  }))
  response.send(camelCaseArray)
})

module.exports = app
