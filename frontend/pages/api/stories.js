import axios from "axios";
import { getServerSession } from "next-auth/next"
import authOptions from "@/lib/auth";
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
        if (req.method === "GET"){
            if (req.query.id){
                let story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${req.query.id}`,{
                    headers: auth
                })
                const st = story.data;
                if ((session && st.mode === "Private" && session.user.id === st.user_id) || st.mode === "Public") {
                    return res.status(200).json(st)
                } else {
                    return res.status(401).json({ message: "Unauthorized" });
                }
            } else if (req.query.username) {
                let stories = []
                stories = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories?=user${req.query.username}`,{
                    headers: auth
                });
                const storyList = stories.data.filter(x => (x.mode === "Private" && session && session.user.id === x.user_id) || x.mode === "Public")
                return res.status(200).json({
                    stories: storyList,
                    total_results: storyList.length
                })
            }else {
                let stories = []
                stories = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories`,{
                    headers: auth
                });
                const storyList = stories.data.filter(x => (x.mode === "Private" && session && session.user.id === x.user_id) || x.mode === "Public")
                return res.status(200).json({
                    stories: storyList,
                    total_results: storyList.length,
                })
            }
        }
        if (req.method === "POST"){
            let story = req.body;
            if (!session) {return res.status(401).json({ message: "Unauthorized" });}
            story.user_id = session.user.id
            const {response, status, storyObj} = await axios.post(`${process.env.BACKEND_URL}/api/v1/stories`, story,{
                headers: auth
            })
            return res.status(200).json({
                response, status, storyObj
            })
        }
        if (req.method === "PUT"){
            const story = req.body;
            const { description, genre, mode, title, tags, id, user_id } = story
            if (!session || session.user.id !== user_id){
                return res.status(401).json({ message: "Unauthorized" });
            }
            const {response, status, storyObj} = await axios.put(`${process.env.BACKEND_URL}/api/v1/stories`, story,{
                headers: auth
            })
            return res.status(200).json({
                response, status, storyObj
            })
        }
        else {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: `Internal server error. ${error}` });
    }
}