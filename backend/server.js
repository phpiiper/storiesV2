import express from 'express'
import cors from 'cors'
import stories from './api/stories.route.js'
import chapters from './api/chapters.route.js'
import users from './api/users.route.js'
import authMiddleware from './authMiddleware.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(authMiddleware)

app.use("/api/v1/stories", stories)
app.use("/api/v1/chapters", chapters)
app.use("/api/v1/users", users)
/*
app.use('*', (req,res) => {
  res.status(404).json({error: "not found"})
})

 */

export default app
