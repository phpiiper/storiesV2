import express from 'express'
import UsersController from './users.controller.js'

const router = express.Router()

// GET
router.route('/').get(UsersController.apiGetUsers)
router.route("/id/:id").get(UsersController.apiGetUserById)
router.route("/username/:username").get(UsersController.apiGetUserByUsername)

// POST
router.route("/").post(UsersController.apiCreateUser)


export default router
