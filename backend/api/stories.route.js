import express from 'express'
import StoriesController from './stories.controller.js'

const router = express.Router()

// GET
router.route('/').get(StoriesController.apiGetStories)
router.route("/id/:id").get(StoriesController.apiGetStoryById)

// POST
router.route("/").post(StoriesController.apiCreateStory)
// PUT
router.route("/").put(StoriesController.apiUpdateStory)


export default router
