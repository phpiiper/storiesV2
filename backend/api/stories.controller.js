import StoriesDAO from '../dao/storiesDAO.js'

export default class StoriesController {
    static async apiGetStories(req,res,next) {
        try {
        const { title, user, genre, tags } = req.query;

        const { data, error } = await StoriesDAO.getStories(title, user, genre, tags)

        let response = {
            data, error
        }
        if (error) { res.status(404).json(response)
        } else { res.status(200).json(response) }

        } catch(e) {
            console.log(`apiGetStories, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetStoryById(req, res, next) {
        try {
            let id = req.params.id || {}
            let {data, error} = await StoriesDAO.getStoryById(id)
            let response = {
                data, error
            }
            if (error) { res.status(404).json(response)
            } else { res.status(200).json(response) }
        } catch(e) {
            console.log(`apiGetStoryById, ${e}`)
            res.status(500).json({error: e})
        }
    }


    static async apiCreateStory(req, res, next){
        try {
            let story = req.body;
            let {data, error} = await StoriesDAO.createStory(story);
            let response = {
                data, error
            }
            if (error) { res.status(404).json(response)
            } else { res.status(200).json(response) }
        } catch(e) {
        console.log(`apiCreateStory, ${e}`)
            res.status(500).json({error: e})
        }
    }


    static async apiUpdateStory(req, res, next){
        try {
            let story = req.body;
            let {data, error} = await StoriesDAO.updateStory(story);
            let response = {
                data, error
            }
            if (error) { res.status(404).json(response)
            } else { res.status(200).json(response) }
        } catch(e) {
        console.log(`apiUpdateStory, ${e}`)
            res.status(500).json({error: e})
        }
    }


}
