import express from 'express'
import ChaptersController from './chapters.controller.js'

const router = express.Router()
// GET
router.route("/id/:id").get(ChaptersController.apiGetChapterById)
router.route("/story").get(ChaptersController.apiGetChaptersByStory)

router.route("/file/:filename").get(ChaptersController.apiGetChapterFileById)

// POST
router.route("/").post(ChaptersController.apiPostChapter)
// PUT
router.route("/").put(ChaptersController.apiUpdateChapter)
// DELETE
router.route("/").delete(ChaptersController.apiDeleteChapter)


export default router
