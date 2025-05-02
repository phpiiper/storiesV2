import {query} from "../index.js";

export default class StoriesDAO {

    static async getStories(title = "", user = "", genre = "", tags = "") {
        try {
            // Prepare wildcards for LIKE queries
            const titleFilter = `%${title}%`;
            const userFilter = `%${user}%`;
            const genreFilter = `%${genre}%`;

            const stories = await query(`SELECT * FROM stories WHERE title ILIKE $1 AND user ILIKE $2 AND genre ILIKE $3`, [titleFilter, userFilter, genreFilter]
            );


            return {
                data: stories.rows,
            };
        } catch (e) {
            console.error(`Something went wrong in getStories: ${e}`);
            return {
                error: e
            };
        }
    }


    static async getStoryById(id) {
        try {
            let story = await query("SELECT * FROM stories WHERE id = $1", [id])
            return {data: story.rows[0] }
        }  catch(e) {
            console.error(`something went wrong in getStoryById: ${e}`)
            return {
                error: e
            };
        }
    }


    static async createStory(storyObj){
        try {
            let response = await query("INSERT INTO stories (user_id, title, description, genre, mode, tags, create_date, last_updated) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp) RETURNING id",[storyObj.user_id,storyObj.title,storyObj.description,storyObj.genre,storyObj.mode,storyObj.tags])

            let returnStory = await query("SELECT * FROM stories WHERE id = $1", [response.rows[0].id])
            return {
                data: returnStory.rows[0],
            }
        } catch(e) {
            console.error(`something went wrong in createStory: ${e}`)
            return {
                error: e
            };
        }
    }

    static async updateStory(storyObj){
        try {
            let q = await query("SELECT * FROM stories WHERE id = $1", [storyObj.id]);
                let response = await query("UPDATE stories SET user_id=$1, title=$2, description=$3, genre=$4, mode=$5, tags=$6, last_updated = current_timestamp WHERE id=$7",[storyObj.user_id,storyObj.title,storyObj.description,storyObj.genre,storyObj.mode,storyObj.tags,storyObj.id])
                // last updated
                await query("UPDATE stories SET last_updated = current_timestamp WHERE id=$1",[storyObj.id])

                return {
                    data: q.rows[0],
                }

        } catch(e) {
            console.error(`something went wrong in createStory: ${e}`)
            return {
                error: e
            };
        }
    }


}
