import {query} from "../index.js";

export default class StoriesDAO {

    static async getStories(title = "", user = "", genre = "", tags = "") {
        try {
            // Prepare wildcards for LIKE queries
            const titleFilter = `%${title}%`;
            const userFilter = `%${user}%`;
            const genreFilter = `%${genre}%`;

            const cursor = await query(
                `SELECT * FROM stories
                WHERE title ILIKE $1
                  AND user ILIKE $2
                 AND genre ILIKE $3`,
                 [titleFilter, userFilter, genreFilter]
            );


            return {
                cursor: cursor,
                totalNumStories: cursor.rowCount
            };
        } catch (e) {
            console.error(`Something went wrong in getStories: ${e}`);
            return {
                stories: [],
                totalNumStories: 0
            };
        }
    }


    static async getStoryById(id) {
        try {
            let cursor = await query("SELECT * FROM stories WHERE id = $1", [id])
            return cursor.rows[0]
        }  catch(e) {
            console.error(`something went wrong in getStoryById: ${e}`)
            throw e
        }
    }


    static async createStory(storyObj){
        try {
            let response = await query("INSERT INTO stories (user_id, title, description, genre, mode, tags, create_date, last_updated) VALUES ($1, $2, $3, $4, $5, $6, current_timestamp, current_timestamp) RETURNING id",[storyObj.user_id,storyObj.title,storyObj.description,storyObj.genre,storyObj.mode,storyObj.tags])

            let returnStory = await query("SELECT * FROM stories WHERE id = $1", [response.rows[0].id])
            return {
                response: response.rows,
                status: response.rowCount,
                storyObj: returnStory.rows[0]
            }
        } catch(e) {
            console.error(`something went wrong in createStory: ${e}`)
            throw e
        }
    }

    static async updateStory(storyObj){
        try {
            let q = await query("SELECT * FROM stories WHERE id = $1", [storyObj.id]);
            if (q.rowCount > 0) {
                let response = await query("UPDATE stories SET user_id=$1, title=$2, description=$3, genre=$4, mode=$5, tags=$6, last_updated = current_timestamp WHERE id=$7",[storyObj.user_id,storyObj.title,storyObj.description,storyObj.genre,storyObj.mode,storyObj.tags,storyObj.id])
                // last updated
                await query("UPDATE stories SET last_updated = current_timestamp WHERE id=$1",[storyObj.id])

                return {
                    response: response,
                    status: response.rowCount
                }

            } else {
                return { status: ["NOT FOUND",400,storyObj]}
            }
        } catch(e) {
            console.error(`something went wrong in createStory: ${e}`)
            throw e
        }
    }


}
