import axios from "axios";
import {IncomingForm} from 'formidable'
import { getServerSession } from "next-auth/next"
import authOptions from "@/lib/auth";
import fs from 'fs/promises'
import FormData from 'form-data';

export const config = {
    api: {
        bodyParser: false
    }
}

export default async (req, res) => {
    const { storyId, chapterId, fileName} = req.query;
    const session = await getServerSession(req, res, authOptions)
    try {
        if (req.method === "GET"){
            if (storyId){
                const story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${storyId}`);

                let chapters = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/story?id=${storyId}`)

                const filteredChapters = chapters.data.chapters.filter(x => x.mode === "Public" || (session && session.user.id === story.data.user_id))

                return res.status(200).json({
                    chapters: filteredChapters,
                    total_results: filteredChapters.length,
                })
            }
            if (chapterId){
                let chapter = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/id/${chapterId}`)

                return res.status(200).json({
                    chapter: chapter.data,
                })

            }
            if (fileName){
                let file = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/file/${fileName}`)
                if (!file) {
                    return res.status(404).json({ message: "File not found" });
                }
                return res.status(200).json({
                    chapter: file.data,
                    fileName: fileName,
                })
            }
        }
        if (req.method === "PUT" || req.method === "POST"){
            const form = new IncomingForm();
            form.uploadDir = "./public/uploads";
            form.keepExtensions = true;

            await form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error("Error parsing form:", err);
                    return res.status(500).json({ message: "Form parsing error" });
                }
                const {storyID, chapterID, chapterName, chapterMode} = fields
                const file = files.file[0]

                const fileBuffer = await fs.readFile(file.filepath)
                const newFormData = new FormData();
                newFormData.append("storyId",JSON.parse(storyID[0]))
                newFormData.append('file', fileBuffer, {
                    filename: file.originalFilename, contentType: file.mimeType
                });
                newFormData.append("chapterId",req.method === "POST" ? chapterID[0] : JSON.parse(chapterID[0]))
                newFormData.append("chapterName",chapterName[0])
                newFormData.append("chapterMode",chapterMode[0])

                let story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${JSON.parse(storyID[0])}`)

                if (story.data){
                    if (!session || story.data.user_id !== session.user.id){
                        return res.status(401).json({ message: "Unauthorized" });
                    }

                    if (req.method === "POST"){
                        const chapter = await axios.post(`${process.env.BACKEND_URL}/api/v1/chapters`,newFormData)
                        const returnData = chapter.data;
                        res.status(200).json({returnData})
                    }
                    if (req.method === "PUT"){
                        const chapter = await axios.put(`${process.env.BACKEND_URL}/api/v1/chapters`,newFormData)
                        const returnData = chapter.data;
                        res.status(200).json({returnData})
                    }
                }
                else {
                    return res.status(405).json({ message: "STORY NOT FOUND" });
                }
            })
        }
        if (req.method === "DELETE"){
            const {storyID, chapterID} = req.query;
            let story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${JSON.parse(storyID[0])}`)

            if (story.data) {
                if (!session || story.data.user_id !== session.user.id) {
                    return res.status(401).json({message: "Unauthorized"});
                }
                const response = await axios.delete(`${process.env.BACKEND_URL}/api/v1/chapters?storyID=${storyID}&chapterID=${chapterID}`)
                return res.status(200).json({
                    response: response.data, status: response.data.status,
                })
            }
            return res.status(401).json({message: "Story doesn't exist."});

        }
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: `Internal server error. ${error}`, fileName });
    }
}