import ChaptersDAO from '../dao/chaptersDAO.js'
import fs from 'fs/promises'

export default class ChaptersController {
    static async apiGetChaptersByStory(req,res,next) {
        const { id } = req.query;

        const { cursor, totalNumChapters } = await ChaptersDAO.getChaptersByStory(id)

        let response = {
            chapters: cursor.rows,
            total_results: totalNumChapters,
        }
        res.json(response)
    }

    static async apiGetChapterById(req, res, next) {
        try {
            let id = req.params.id || {}
            let chapter = await ChaptersDAO.getChapterById(id)
            if(!chapter) {
                res.status(404).json({ error: "not found", id: id})
                return
            }
            res.json(chapter)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e, id: req.params.id})
        }
    }

    static async apiGetChapterFileById(req, res, next) {
        try {
            let id = req.params.fileName || 0
            let {chapter, error, filename} = await ChaptersDAO.getChapterFile(id)
            if(!chapter) {
                res.status(404).json({ error: error, filename, msg: "uhoh"})
                return
            }
            res.json({
                chapter: chapter
            })
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiPostChapter(req, res, next){
        try {
            const {storyId, chapterName, chapterMode} = req.body;
            const file = req.file;
            if (!file) {
                console.error("no file")
                res.status(408).json({error: "no file"})
                console.log(req.headers)
            }
            let {chapter, status, postgres} = await ChaptersDAO.postChapter(storyId, file, chapterName, chapterMode)
            res.json({
                chapter, status, postgres
            })
        } catch(e) {
        console.log(`api, ${e}`)
            res.status(500).json({error: e, })
        }
    }

    static async apiUpdateChapter(req, res, next){
        try {
            const {storyId, chapterId, chapterName, chapterMode} = req.body;
            const file = req.file;
            if (!file) {
                console.error("no file")
                res.status(408).json({error: "no file"})
                console.log(req.headers)
            }

            let {chapter, status} = await ChaptersDAO.updateChapter(storyId, file, chapterId, chapterName, chapterMode)
            res.json({
                chapter, status
            })
        } catch(e) {
        console.log(`apiUpdateChapter api, ${e}`)
            res.status(500).json({error: e, })
        }
    }

    static async apiDeleteChapter(req, res, next){
        try {

            const {chapterID} = req.query;
            let {chapter, status, headers, postgres, msg} = await ChaptersDAO.deleteChapterById(chapterID)
            res.json({
                chapter, status, headers, postgres, msg
            })
        } catch(e) {
            console.log(`apiDeleteChapter, ${e}`)
            res.status(500).json({error: e})
        }
    }
}
