
// # Todo Application

// Given an `app.js` file and an empty database file `todoApplication.db`.

// Create a table with the name `todo` with the following columns,

// **Todo Table**

// | Column   | Type    |
// | -------- | ------- |
// | id       | INTEGER |
// | todo     | TEXT    |
// | priority | TEXT    |
// | status   | TEXT    |

// and write APIs to perform operations on the table `todo`,

// <MultiLineNote>
  
//   - Replace the spaces in URL with `%20`.
//   - Possible values for `priority` are `HIGH`, `MEDIUM`, and `LOW`.
//   - Possible values for `status` are `TO DO`, `IN PROGRESS`, and `DONE`.
// </MultiLineNote>

// ### API 1

// #### Path: `/todos/`

// #### Method: `GET`

// - **Scenario 1**

//   - **Sample API**
//     ```
//     /todos/?status=TO%20DO
//     ```
//   - **Description**:

//     Returns a list of all todos whose status is 'TO DO'

//   - **Response**

//     ```
//     [
//       {
//         id: 1,
//         todo: "Watch Movie",
//         priority: "LOW",
//         status: "TO DO"
//       },
//       ...
//     ]
//     ```

// - **Scenario 2**

//   - **Sample API**
//     ```
//     /todos/?priority=HIGH
//     ```
//   - **Description**:

//     Returns a list of all todos whose priority is 'HIGH'

//   - **Response**

//     ```
//     [
//       {
//         id: 2,
//         todo: "Learn Node JS",
//         priority: "HIGH",
//         status: "IN PROGRESS"
//       },
//       ...
//     ]
//     ```

// - **Scenario 3**

//   - **Sample API**
//     ```
//     /todos/?priority=HIGH&status=IN%20PROGRESS
//     ```
//   - **Description**:

//     Returns a list of all todos whose priority is 'HIGH' and status is 'IN PROGRESS'

//   - **Response**

//     ```
//     [
//       {
//         id: 2,
//         todo: "Learn Node JS",
//         priority: "HIGH",
//         status: "IN PROGRESS"
//       },
//       ...
//     ]
//     ```

// - **Scenario 4**

//   - **Sample API**
//     ```
//     /todos/?search_q=Play
//     ```
//   - **Description**:

//     Returns a list of all todos whose todo contains 'Play' text

//   - **Response**

//     ```
//     [
//       {
//         id: 4,
//         todo: "Play volleyball",
//         priority: "MEDIUM",
//         status: "DONE"
//       },
//       ...
//     ]
//     ```

// ### API 2

// #### Path: `/todos/:todoId/`

// #### Method: `GET`

// #### Description:

// Returns a specific todo based on the todo ID

// #### Response

// ```
// {
//   id: 2,
//   todo: "Learn JavaScript",
//   priority: "HIGH",
//   status: "DONE"
// }
// ```

// ### API 3

// #### Path: `/todos/`

// #### Method: `POST`

// #### Description:

// Create a todo in the todo table,

// #### Request

// ```
// {
//   "id": 10,
//   "todo": "Finalize event theme",
//   "priority": "LOW",
//   "status": "TO DO"
// }
// ```

// #### Response

// ```
// Todo Successfully Added
// ```

// ### API 4

// #### Path: `/todos/:todoId/`

// #### Method: `PUT`

// #### Description:

// Updates the details of a specific todo based on the todo ID

// - **Scenario 1**

//   - **Request**
//     ```
//     {
//       "status": "DONE"
//     }
//     ```
//   - **Response**

//     ```
//     Status Updated
//     ```

// - **Scenario 2**

//   - **Request**
//     ```
//     {
//       "priority": "HIGH"
//     }
//     ```
//   - **Response**

//     ```
//     Priority Updated
//     ```

// - **Scenario 3**

//   - **Request**
//     ```
//     {
//       "todo": "Some task"
//     }
//     ```
//   - **Response**

//     ```
//     Todo Updated
//     ```

// ### API 5

// #### Path: `/todos/:todoId/`

// #### Method: `DELETE`

// #### Description:

// Deletes a todo from the todo table based on the todo ID

// #### Response

// ```
// Todo Deleted
// ```

// <br/>

// Use `npm install` to install the packages.

// **Export the express instance using the default export syntax.**

// **Use Common JS module syntax.**


const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    await db.run(`CREATE TABLE IF NOT EXISTS todo (
                  id INTEGER PRIMARY KEY,
                  todo TEXT,
                  priority TEXT,
                  status TEXT
    )`)

    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//get todos API
app.get('/todos/', async (request, response) => {
  const {status, priority, search_q = ''} = request.query

  let getTodosQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`

  if (status !== undefined) {
    getTodosQuery += ` AND status = '${status}'`
  }

  if (priority !== undefined) {
    getTodosQuery += ` AND priority = '${priority}'`
  }

  const todosArray = await db.all(getTodosQuery)
  response.send(todosArray)
})

//get todo API
app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoQuery = `SELECT * FROM todo WHERE id = ?`
  const todo = await db.get(getTodoQuery, [todoId])
  response.send(todo)
})

//add todo API
app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const addTodoQuery = `INSERT INTO todo(id, todo, priority, status) VALUES(?,?,?,?)`
  await db.run(addTodoQuery, [id, todo, priority, status])
  response.send('Todo Successfully Added')
})

//update todo API
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const {status, priority, todo} = request.body

  let updateQuery = ''

  if (status !== undefined) {
    updateQuery = `UPDATE todo SET status = ? WHERE id = ?`
    await db.run(updateQuery, [status, todoId])
    response.send(`Status Updated`)
  } else if (priority !== undefined) {
    updateQuery = `UPDATE todo SET priority = ? WHERE id = ?`
    await db.run(updateQuery, [priority, todoId])
    response.send('Priority Updated')
  } else if (todo !== undefined) {
    updateQuery = `UPDATE todo SET todo = ? WHERE id = ?`
    await db.run(updateQuery, [todo, todoId])
    response.send('Todo Updated')
  }
})

//delete todo API
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `DELETE FROM todo WHERE id = ?`
  await db.run(deleteTodoQuery, [todoId])
  response.send('Todo Deleted')
})

module.exports = app
