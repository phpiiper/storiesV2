import bcrypt from "bcryptjs"
import axios from "axios";
import EmailValidator from 'email-validator'

export default async (req, res) => {
    try {
        if (req.body) {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

            if (req.method === "POST") {
                if (body.username.length < 5){
                    return res.status(400).json({
                        message: "Username must be longer than 5 characters!"
                    });
                }
                if (body.password.length < 5){
                    return res.status(400).json({
                        message: "Password must be longer than 5 characters!"
                    });
                }
                if (EmailValidator.validate(body.email) === false){
                    return res.status(400).json({
                        message: "Email is invalid!"
                    })
                }

                const users = await axios.get(`${process.env.BACKEND_URL}/api/v1/users`)
                const user_exists = users.data.filter(user => user.username === body.username)
                if (user_exists.length === 1){
                    return res.status(400).json({
                        message: "Username is taken!"
                    });
                }
                const email_exists = users.data.filter(user => user.email === body.email)
                if (email_exists.length === 1){
                    return res.status(400).json({
                        message: "Email is taken!"
                    })
                }
                // ELSE: create an account
                const salt = await bcrypt.genSalt(10);
                const username = body.username;
                const password = await bcrypt.hash(body.password,salt)
                const email = body.email;

                // postgresql add user (Axios)
                const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/users`, {
                        username, password, email
                })

                return res.status(200).json({
                    message: 'Data inserted successfully',
                    insertedId: "####",
                    response: response.data,
                    things: {
                        username, password
                    }
                });
            }
            return res.status(405).json({ message: "Method Not Allowed" });
        }
        else {res.status(400).json({message: "No request body!"});}

    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: `Internal server error. ${error}` });
    }
};
