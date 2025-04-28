import express from 'express'
import multer from 'multer'
import ChaptersController from './chapters.controller.js'

const router = express.Router()
const upload = multer({dest: "../uploads/"})
// GET
router.route("/id/:id").get(ChaptersController.apiGetChapterById)
router.route("/story").get(ChaptersController.apiGetChaptersByStory)

router.route("/file/:fileName").get(ChaptersController.apiGetChapterFileById)

// POST
router.route("/").post(upload.single("file"), ChaptersController.apiPostChapter)
// PUT
router.route("/").put(upload.single("file"), ChaptersController.apiUpdateChapter)
// DELETE
router.route("/").delete(ChaptersController.apiDeleteChapter)


export default router
