import axios from "axios";
export default async (req, res) => {
    try {
        if (req.method === "GET"){
            const { id, username, text} = req.query;
            if (id || username){
                let user;
                if (id){
                    user = await axios.get(`${process.env.BACKEND_URL}/api/v1/users/id/${id}`)
                } else { // username
                    user = await axios.get(`${process.env.BACKEND_URL}/api/v1/users/username/${id}`)
                }
                return res.status(200).json({
                    user: user.data
                })
            }
            if (text){
                let chapter = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/id/${chapterId}`)

                return res.status(200).json({
                    chapter: chapter.data,
                })

            }
        }
        else {
            return res.status(405).json({ message: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: `Internal server error. ${error}` });
    }
}