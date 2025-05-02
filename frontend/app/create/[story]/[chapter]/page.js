'use client'
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "../../../components/HomeBar";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown';
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

import { useSnackbar } from '@/app/providers/snackbar';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


export default function EditChapter(){
    const router = useRouter();
    const params = useParams()
    const { story: storyID, chapter: chapterIndex } = params;
    const DownloadRef = useRef(null);
    const [chapter, setChapter] = useState(undefined);
    const [chapterText, setChapterText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // SNACKBAR
    const {showSnackbar} = useSnackbar();


    const editor = useEditor({
        extensions: [StarterKit,Markdown,Underline,CharacterCount],
        content: chapterText,
        immediatelyRender: false
    })

    useEffect(() => {
        if (!storyID) {setIsError(true); return}
        async function getChapterData() {
            const chapters = await axios.get(`/api/chapters?storyId=${storyID}`)
            if (chapters.status !== 200) {setIsError(true); return}
            const ch = chapters.data[chapterIndex-1]
            setChapter(ch)
            const chapterFile = await axios.get(`/api/chapters?fileName=${ch.file}`)
            if (chapterFile.status !== 200) {setIsError(true); return}
            setChapterText(chapterFile.data)
            setIsLoading(false)
        }
        getChapterData()
    },[storyID])

    useEffect(() => {
        if (editor && chapterText) {
            editor.commands.setContent(chapterText);
        }
    }, [editor, chapterText]);



    async function saveChapter() {
        // Create BLOB of chapter.text
        const text = editor.storage.markdown.getMarkdown();
        let blob = new Blob([text], { type: "text/markdown" });
        const file = new File([blob], `${chapter.name}.md`, { type: "text/markdown" });

        const formData = new FormData();
        formData.append("storyId",chapter.story_id)
        formData.append('file', file);
        formData.append("chapterId",chapter.id)
        formData.append("chapterName",chapter.name)
        formData.append("chapterMode",chapter.mode)
        formData.append("chapterFileName",chapter.file)

        const res = await axios.put(`/api/chapters`, formData)
        if (res.status !== 200) {
            showSnackbar("Error saving chapter.")
            return
        }
        showSnackbar("Chapter saved!")
    }

    const deleteChapter = async () => {
        const res = await axios.delete(`/api/chapters?storyID=${storyID}&chapterID=${chapter.id}&chapterFileName=${chapter.file}`)
        if (res.status !== 200) {
            showSnackbar("Error deleting chapter.")
            return
        }
        showSnackbar("Chapter deleted!")
        await router.push(`/create/${storyID}`)
    }

    if (isError){
        return (<>
            <HomeBar />
            <ErrorPage error={404} msg={isError ? "ERROR FETCHING STORY" : "NOT AUTHENTICATED"}></ErrorPage>
        </>)
    }

    if (isLoading){
        return (<>
            <HomeBar />
            <LoadingDiv />
        </>)
    }


    return (<>
        <a id={"download"} ref={DownloadRef}/>
        <HomeBar />
        <div className={"edit-chapter-page"}>
            <div className={"button-list row sticky-top"}>
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    href={"/create/" + storyID}
                > GO BACK </Button>
                <Button
                    variant={"contained"}
                    color={"error"}
                    onClick={deleteChapter}
                > DELETE </Button>
                <Button
                    variant={"contained"}
                    onClick={saveChapter}
                > SAVE </Button>
                {process.env.NODE_ENV === "development" &&<Button
                    variant={"contained"}
                    onClick={()=>{console.log(chapter); console.log(editor.storage.markdown.getMarkdown());}}
                > LOG </Button>}
            </div>
            <TextField
                id={"chapter-name"}
                value={chapter.name}
                label={"Chapter Name"}
                onChange={(event) => {setChapter({...chapter,name:event.target.value})}}
                fullWidth
            />
            <TextField
                id={"chapter-mode"}
                label={"Mode"}
                value={chapter.mode}
                onChange={(event) => {setChapter({...chapter,mode:event.target.value})}}
                select
            >
                <MenuItem value={"Private"}>Private</MenuItem>
                <MenuItem value={"Public"}>Public</MenuItem>
            </TextField>
            <div className="control-group">
                <div className="tiptap-button-list button-list row">
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={"tiptap-editor-button " + (editor.isActive('bold') ? 'is-active' : '')}>B</button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={"tiptap-editor-button " + (editor.isActive('italic') ? 'is-active' : '')}>I</button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={"tiptap-editor-button " + (editor.isActive('underline') ? 'is-active' : '')}>U</button>
                </div>
                <div className={"ttiptap-info-list"}>
                    {editor.storage.characterCount.words()} words, {editor.storage.characterCount.characters()} characters
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    </>)
}