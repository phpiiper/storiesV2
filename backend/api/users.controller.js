import UsersDAO from '../dao/usersDAO.js'

export default class UsersController {
    static async apiGetUsers(req,res,next) {
        const { username } = req.query;

        const { cursor, totalNumUsers } = await UsersDAO.getUsers(username)

        let response = {
            users: cursor.rows,
            total_results: totalNumUsers,
        }
        res.json(response.users)
    }

    static async apiGetUserById(req, res, next) {
        try {
            let id = req.params.id || {}
            let user = await UsersDAO.getUserById(id)
            if(!user) {
                res.status(404).json({ error: "not found"})
                return
            }
            res.json(user)
        } catch(e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetUserByUsername(req, res, next) {
        try {
            let id = req.params.id || {}
            let user = await UsersDAO.getUserByUsername(id)
            if(!user) {
                res.status(404).json({ error: "not found"})
                return
            }
            res.json(user)

        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
    static async apiGetUsersByText(req, res, next) {
        try {
            let text = req.params.text || {}
            let users = await UsersDAO.getUsersByText(text)
            if(!users) {
                res.status(404).json({ error: "not found"})
                return
            }
            res.json(users)

        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


    static async apiCreateUser(req, res, next){
        try {
            let user = req.body;
            let {response, status, userObj} = await UsersDAO.createUser(user);
            res.json({
                response, status, userObj
            })
        } catch(e) {
        console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }


}
