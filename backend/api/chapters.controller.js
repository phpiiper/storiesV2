import ChaptersDAO from '../dao/chaptersDAO.js'
import fs from 'fs/promises'

export default class ChaptersController {
    static async apiGetChaptersByStory(req,res,next) {
        try {
            const { id } = req.query;

            const { data, error } = await ChaptersDAO.getChaptersByStory(id)

            let response = {
                data: data?.rows,
                error: error,
            }
            if (error) { res.status(404).json(response)
            } else { res.status(200).json(response) }
        } catch(e) {
            res.status(500).json({error: e})
        }
    }

    static async apiGetChapterById(req, res, next) {
        try {
            const {id} = req.params
            let {data, error } = await ChaptersDAO.getChapterById(id)
            let response = {
                data: data,
                error: error,
            }
            if (error) { res.status(404).json(response)
            } else { res.status(200).json(response) }

        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetChapterFileById(req, res, next) {
        try {
            const id = req.params.filename
            let {chapter, error, filename} = await ChaptersDAO.getChapterFile(id)
            let response = {
                data: chapter,
                error: error,
                filename: filename,
            }
            if (error || !chapter) { return res.status(404).json(response)}
            return res.status(200).json({
                data: chapter
            })
        } catch(e) {
            console.log(`apiGetChapterByFileId, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiPostChapter(req, res, next){
        try {
            const {storyId, chapterName, chapterMode, fileUrl} = req.body;

            let {chapter, status, error} = await ChaptersDAO.postChapter(storyId, fileUrl, chapterName, chapterMode)
            //
            res.json({
                data: chapter, status, error
            })
        } catch(e) {
        console.log(`apiPostChapter, ${e}`)
            res.status(500).json({error: e, })
        }
    }

    static async apiUpdateChapter(req, res, next){
        try {
            const {storyId, chapterName, chapterId, chapterMode, chapterFileName, fileUrl} = req.body;

            let {chapter, status, error} = await ChaptersDAO.updateChapter(storyId, fileUrl, chapterId, chapterName, chapterMode, chapterFileName)
            //
            res.json({
                chapter, status, error
            })
        } catch(e) {
            console.log(`apiUpdateChapter, ${e}`)
            res.status(500).json({error: e, })
        }
    }

    static async apiDeleteChapter(req, res, next){
        try {

            const {chapterID, fileName} = req.query;
            let {chapter, status, error} = await ChaptersDAO.deleteChapterById(chapterID, fileName)
            res.json({
                data: chapter, status, error
            })
        } catch(e) {
            console.log(`apiDeleteChapter, ${e}`)
            res.status(500).json({error: e})
        }
    }
}
