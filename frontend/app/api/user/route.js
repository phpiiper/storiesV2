import bcrypt from "bcryptjs";
import axios from "axios";
const auth = { Authorization: `Bearer ${process.env.AUTH_TOKEN}` };

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body.username || body.username.length < 5) {
            return new Response(JSON.stringify({
                message: "Username must be longer than 5 characters!"
            }), { status: 400 });
        }

        if (!body.password || body.password.length < 5) {
            return new Response(JSON.stringify({
                message: "Password must be longer than 5 characters!"
            }), { status: 400 });
        }

        const users = await axios.get(`${process.env.BACKEND_URL}/api/v1/users`, { headers: auth });
        const user_exists = users.data.find(user => user.username === body.username);

        if (user_exists) {
            return new Response(JSON.stringify({
                message: "Username is taken!"
            }), { status: 400 });
        }

        // Create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);

        const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/users`, {
            username: body.username,
            password: hashedPassword
        }, { headers: auth });

        return new Response(JSON.stringify({
            message: 'Data inserted successfully',
            insertedId: "####",  // If you get an inserted ID from response.data, you can update this.
            response: response.data,
            things: {
                username: body.username,
                password: hashedPassword
            }
        }), { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({
            message: `Internal server error. ${error.message}`
        }), { status: 500 });
    }
}

export async function GET(request){
    const query = request.nextUrl.searchParams
    const id = query.get('id')
    const username = query.get('username')
    const text = query.get('text')
    try {
        if (id || username) {
            let user;
            if (id) {
                user = await axios.get(`${process.env.BACKEND_URL}/api/v1/users/id/${id}`, {
                    headers: auth
                })
            } else { // username
                user = await axios.get(`${process.env.BACKEND_URL}/api/v1/users/username/${id}`, {
                    headers: auth
                })
            }
            return new Response(JSON.stringify({
                user: user.data
            }), {status: 200});
        }
        if (text) {
            let users = await axios.get(`${process.env.BACKEND_URL}/api/v1/users/username/${text}`)

            return new Response(JSON.stringify({
                user: users.data
            }), {status: 200});

        }
    } catch (e) {
        console.error(e)
    }
    return new Response(JSON.stringify({msg: "ERROR: NO MATCH", queries: {
        id, username, text
    }}), {status: 401});
}
