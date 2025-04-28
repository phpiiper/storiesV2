import axios from "axios";
import { getServerSession } from "next-auth/next"
import authOptions from "../../lib/auth";
import {put, del} from "@vercel/blob"

export async function GET(request) {
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}


    const query = request.nextUrl.searchParams
    const storyId = query.get('storyId')
    const chapterId = query.get('chapterId')
    const fileName = query.get('fileName')
    try {
        if (storyId) {
            const story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${storyId}`, {
                headers: auth
            });

            let chapters = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/story?id=${storyId}`, {
                headers: auth
            })

            const filteredChapters = chapters.data.chapters.filter(x => x.mode === "Public" || (session && session.user.id === story.data.user_id))

            return new Response(JSON.stringify({
                chapters: filteredChapters,
                total_results: filteredChapters.length,
            }), {status: 200});
        }
        if (chapterId) {
            let chapter = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/id/${chapterId}`, {
                headers: auth
            })

            return new Response(JSON.stringify({
                chapter: chapter.data,
            }), {status: 200});

        }
        if (fileName) {
            let file = await axios.get(`${process.env.BACKEND_URL}/api/v1/chapters/file/${fileName}`, {
                headers: auth
            })
            if (!file) {
                return new Response(JSON.stringify({msg: "Not Found"}), {status: 404});
            }
            return new Response(JSON.stringify({
                chapter: file.data,
                fileName: fileName,
            }), {status: 200});
        }
    } catch (e) {
        console.error(e)
        return new Response(JSON.stringify({msg: "ERROR", error: e}), {status: 401});
    }
    return new Response(JSON.stringify({msg: "ERROR: NO MATCH", queries: {
        storyId, chapterId, fileName
    }}), {status: 401});
}



export async function PUT(request) {
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    const form = await request.formData();

    const story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${form.get('storyId')}`,{headers: auth});
    if (!story.data || story.data.user_id !== session.user.id){
        return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
    }

    const file = form.get('file');
    const blob = await put(file.name, file, {
        access: "public", allowOverwrite: true,
    })
    const res = await axios.put(`${process.env.BACKEND_URL}/api/v1/chapters`, {
        storyId: form.get('storyId'),
        chapterName: form.get('chapterName'),
        chapterMode: form.get('chapterMode'),
        fileUrl: blob.url
    }, {
        headers: auth
    })
    await del(blob.url);


    return new Response(JSON.stringify({
        response: res.data
    }), {status: 200});

}

export async function POST(request) {
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    const form = await request.formData();

    const story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${form.get('storyId')}`,{headers: auth});
    if (!story.data || story.data.user_id !== session.user.id){
        return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
    }

    const file = form.get('file');
    const blob = await put(file.name, file, {
        access: "public", allowOverwrite: true,
    })
    const res = await axios.post(`${process.env.BACKEND_URL}/api/v1/chapters`, {
        storyId: form.get('storyId'),
        chapterName: form.get('chapterName'),
        chapterMode: form.get('chapterMode'),
        fileUrl: blob.url
    }, {
        headers: auth
    })
    await del(blob.url);


    return new Response(JSON.stringify({
        response: res.data
    }), {status: 200});

}


export async function DELETE(request) {
    const session = await getServerSession(authOptions)
    const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}
    const query = request.nextUrl.searchParams
    const storyID = query.get('storyID')
    const chapterID = query.get('chapterID')
    let story = await axios.get(`${process.env.BACKEND_URL}/api/v1/stories/id/${JSON.parse(storyID[0])}`,{
        headers: auth
    })

    if (story.data) {
        if (!session || story.data.user_id !== session.user.id) {
            return new Response(JSON.stringify({msg: "Unauthorized"}), {status: 400});
        }
        const response = await axios.delete(`${process.env.BACKEND_URL}/api/v1/chapters?storyID=${storyID}&chapterID=${chapterID}`,{
            headers: auth
        })
        return new Response(JSON.stringify({
            response: response.data, status: response.data.status,
        }), {status: 200});
    }
    return new Response(JSON.stringify({msg: "Story doesn't exist"}), {status: 401});

}
