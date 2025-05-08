import axios from "axios";
import { getServerSession } from "next-auth/next"
import authOptions from "../../lib/auth";

export async function GET(request){
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    const query = request.nextUrl.searchParams

    if (query.get('id')){
        let story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${query.get('id')}`,{
            headers: auth
        })
        const st = story.data.data;
        if ((session && st.mode === "Private" && session.user.id === st.user_id) || st.mode === "Public") {
            return new Response(JSON.stringify(st), {status: 200});
        } else {
            return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
        }
    } else if (query.get('username')){
        let stories = []
        stories = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories?=user${query.get('username')}`,{
            headers: auth
        });
        const storyList = stories.data.data.filter(x => (x.mode === "Private" && session && session.user.id === x.user_id) || x.mode === "Public")
        return new Response(JSON.stringify(storyList), {status: 200});
    }else {
        let filters = {}
        query.forEach((value, key) => {
            filters[key] = value;
        })
        let stories = []
        stories = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories`,{
            headers: auth,
            params: filters
        });

        if (stories.data.error){
        return new Response(JSON.stringify({error: stories.data.error, msg: "Unauthorized"}), {status: 400});
        }

        const storyList = stories.data.data.filter(x => (x.mode === "Private" && session && session.user.id === x.user_id) || x.mode === "Public")
        return new Response(JSON.stringify(storyList), {status: 200});
    }
}

export async function POST(request){
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    let story = await request.json();
    if (!session) {
        return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
    }
    story.user_id = session.user.id
    const {response, status, storyObj} = await axios.post(`${process.env.BACKEND_URL}/api/v1/stories`, story,{
        headers: auth
    })
    return new Response(JSON.stringify({
        response, status, storyObj
    }), {status: 200});
}

export async function PUT(request){
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    let story = await request.json();
    const { description, genre, mode, title, tags, id, user_id } = story
    if (!session || session.user.id !== user_id){
        return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
    }
    const {response, status, storyObj} = await axios.put(`${process.env.BACKEND_URL}/api/v1/stories`, story,{
        headers: auth
    })
    return new Response(JSON.stringify({
        response, status, storyObj
    }), {status: 200});
}
