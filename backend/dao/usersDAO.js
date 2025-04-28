import {query} from "../index.js";

export default class UsersDAO {

    static async getUsers(username = "") {
        try {
            // Prepare wildcards for LIKE queries
            const usernameFilter = `%${username}%`;
            const cursor = await query(`SELECT * FROM users WHERE username ILIKE $1`,[usernameFilter]);

            return {
                cursor: cursor,
                totalNumUsers: cursor.rowCount
            };
        } catch (e) {
            console.error(`Something went wrong in getUsers: ${e}`);
            return {
                users: [],
                totalNumUsers: 0
            };
        }
    }


    static async getUserById(id) {
        try {
            let cursor = await query("SELECT * FROM users WHERE id = $1", [id])
            return cursor.rows[0]
        }  catch(e) {
            console.error(`something went wrong in getUserById: ${e}`)
            throw e
        }
    }

    static async getUserByUsername(id) {
        try {
            let cursor = await query("SELECT * FROM users WHERE username = $1", [id])
            return cursor.rows[0]
        }  catch(e) {
            console.error(`something went wrong in getUserByUsername: ${e}`)
            throw e
        }
    }
    static async getUsersByText(text) {
        try {
            let cursor = await query("SELECT * FROM users WHERE username ILIKE $1", [`%${text}%`])
            return cursor.rows[0]
        }  catch(e) {
            console.error(`something went wrong in getUserByUsername: ${e}`)
            throw e
        }
    }


    static async createUser(userObj){
        try {
            let response = await query("INSERT INTO users (username, password, prefs) VALUES ($1, $2, $3) RETURNING id",[userObj.username,userObj.password,userObj.prefs ? userObj.prefs : {}])

            let returnUser = await query("SELECT * FROM users WHERE id = $1", [response.rows[0].id])
            return {
                response: response.rows,
                status: response.rowCount,
                userObj: returnUser.rows[0]
            }
        } catch(e) {
            console.error(`something went wrong in createUser: ${e}`)
            throw e
        }
    }


}
