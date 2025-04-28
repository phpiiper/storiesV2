import {useRouter} from "next/router";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "@/components/HomeBar";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";

export default function EditChapter(){
    const router = useRouter();
    const { story: storyID, chapter: chapterIndex } = router.query;
    const DownloadRef = useRef(null);
    const [chapter, setChapter] = useState(undefined);
    const [chapterText, setChapterText] = useState("");

    useEffect(() => {
        if (!router.isReady) {return}
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
    },[router.isReady])

    async function saveChapter() {
        console.log("SAVE CHAPTER")
        // Create BLOB of chapter.text
        let blob = new Blob([chapterText], { type: "text/markdown" });
        const file = new File([blob], `${chapter.name}.md`, { type: "text/markdown" });

        const formData = new FormData();
        formData.append("storyID",chapter.story_id)
        formData.append('file', file);
        formData.append("chapterID",chapter.id)
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

    if (!chapter) {return <div>Loading...</div>}

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