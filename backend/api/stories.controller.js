import StoriesDAO from '../dao/storiesDAO.js'

export default class StoriesController {
    static async apiGetStories(req,res,next) {
        const { title, user, genre, tags } = req.query;

        const { cursor, totalNumStories } = await StoriesDAO.getStories(title, user, genre, tags)

        let response = {
            stories: cursor.rows,
            cursor: cursor,
            total_results: totalNumStories,
        }
        res.json(response.stories)
    }

    static async apiGetStoryById(req, res, next) {
        try {
            let id = req.params.id || {}
            let story = await StoriesDAO.getStoryById(id)
            if(!story) {
                res.status(404).json({ error: "not found"})
                return
            }
            res.json(story)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


    static async apiCreateStory(req, res, next){
        try {
            let story = req.body;
            let {response, status, storyObj} = await StoriesDAO.createStory(story);
            res.json({
                response, status, storyObj
            })
        } catch(e) {
        console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


    static async apiUpdateStory(req, res, next){
        try {
            let story = req.body;
            let {response, status} = await StoriesDAO.updateStory(story);
            res.json({
                response, status
            })
        } catch(e) {
        console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


}
