'use client'
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "../../../components/HomeBar";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import LoadingDiv from "@/app/components/LoadingDiv";

export default function EditChapter(){
    const router = useRouter();
    const params = useParams()
    const { story: storyID, chapter: chapterIndex } = params;
    const DownloadRef = useRef(null);
    const [chapter, setChapter] = useState(undefined);
    const [chapterText, setChapterText] = useState("");

    useEffect(() => {
        if (!storyID) {return}
        async function getChapterData() {
            const chapters = await axios.get(`/api/chapters?storyId=${storyID}`)
            if (!chapters.data) {return}
            const ch = chapters.data.chapters[chapterIndex-1]
            setChapter(ch)
            const chapterFile = await axios.get(`/api/chapters?fileName=${ch.file}`)
            if (!chapterFile.data) {return}
            setChapterText(chapterFile.data.chapter.chapter)
        }
        getChapterData()
    },[storyID])

    async function saveChapter() {
        console.log("SAVE CHAPTER")
        // Create BLOB of chapter.text
        let blob = new Blob([chapterText], { type: "text/markdown" });
        const file = new File([blob], `${chapter.name}.md`, { type: "text/markdown" });

        const formData = new FormData();
        formData.append("storyId",chapter.story_id)
        formData.append('file', file);
        formData.append("chapterId",chapter.id)
        formData.append("chapterName",chapter.name)
        formData.append("chapterMode",chapter.mode)

        const res = await axios.put(`/api/chapters`, formData)
        console.log(res)
        console.log(res.status)
        console.log(res.data)


    }

    const deleteChapter = async () => {
        console.log("DELETE CHAPTER")
        const res = await axios.delete(`/api/chapters?storyID=${storyID}&chapterID=${chapter.id}`)
        console.log(res.data)
        await router.push(`/create/${storyID}`)
    }

    if (!chapter) {return <LoadingDiv />}

    return (<>
        <a id={"download"} ref={DownloadRef}/>
        <HomeBar />
        <div className={"edit-chapter-page"}>
            <div className={"button-list row"}>
                <Button
                    variant={"contained"}
                    href={"/create/" + storyID}
                > GO BACK </Button>
                <Button
                    variant={"contained"}
                    onClick={deleteChapter}
                > DELETE </Button>
                <Button
                    variant={"contained"}
                    onClick={saveChapter}
                > SAVE </Button>
            </div>
            <TextField
                id={"chapter-name"}
                value={chapter.name}
                label={"Chapter Name"}
                onChange={(event) => {setChapter({...chapter,name:event.target.value})}}
                fullWidth
            />
            <TextField
                id={"chapter-text"}
                className={"edit-chapter-editor"}
                value={chapterText}
                label={"Text"}
                multiline
                maxRows={20}
                minRows={20}
                onChange={(event) => {setChapterText(event.target.value)}}
            />
        </div>
    </>)
}