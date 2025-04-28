'use client'
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditChapter({funcs, chapters, chapterID}) {
    const ch = chapters.find(x => x.id === chapterID)
    const [chapterFileText, setChapterFileText] = useState("")

    useEffect(() => {
        if (ch){
           async function getFile() {
                const file = await axios.get(`/api/chapters?fileName=${ch.file}`)
                if (file.data){
                    setChapterFileText(file.data.chapter.chapter)
                }
           }
           getFile()
        }
    }, [ch]);

    return(<><div className={"edit-chapter-div"} key={"ch-"+chapterID}>
        <div className={"button-list row"}>
            <Button color={"error"} variant={"contained"} onClick={() => {funcs.deleteChapter(ch.id)}}>DELETE</Button>
            <Button className={"button-a"} variant={"contained"} href={`/create/${ch.story_id}/${chapters.findIndex(x => x.id === chapterID)+1}`}>EDIT</Button>
            {ch.mode === "Public" ? (<Button variant={"contained"} onClick={() => {console.log(`change mode: ${ch.mode}`)}}>Make Private</Button>) : <Button variant={"contained"} onClick={() => {console.log(`change mode: ${ch.mode}`)}}>Make Public</Button>}

        </div>
            <span className={"chapter-name"}>{ch.name}</span>
    </div>
    </>
    )
}