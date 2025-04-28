import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";

export default function EditChapter({funcs, setChapters, chapters, chapterID}) {
    const ch = chapters.find(x => x.id === chapterID)
    const [openEditor, setEditor] = useState(false)
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
        <span className={"chapter-name"}>{ch.name}</span>
        <Button variant={"contained"} href={`/create/${ch.story_id}/${chapters.findIndex(x => x.id === chapterID)+1}`}>EDIT</Button>
        <Button variant={"contained"} onClick={() => {funcs.deleteChapter(ch.id)}}>DELETE</Button>
    </div>
    </>
    )
}