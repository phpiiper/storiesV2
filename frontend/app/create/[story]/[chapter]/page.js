'use client'
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "../../../components/HomeBar";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown';
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

import { useSnackbar } from '@/app/providers/snackbar';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


export default function EditChapter(){
    const router = useRouter();
    const params = useParams()
    const { story: storyID, chapter: chapterIndex } = params;
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
            <LoadingDiv />
        </>)
    }


    return (<div className={"page edit-chapter-page"}>
        <div className={"flex"}>
            <label htmlFor={"chapter-name"}><EditRoundedIcon/></label>
            <input
                className={"edit-chapter-input"}
                id={"chapter-name"}
                value={chapter.name}
                onChange={(event) => {setChapter({...chapter,name:event.target.value})}}
            />
        </div>
            <div className={"container row"}>
                <div className={"container-div"}>
                    <div className={"flex"}>
                        <label htmlFor={"chapter-mode"}><EditRoundedIcon/></label>
                    <select
                        className={"edit-chapter-input"}
                        id={"chapter-mode"}
                        value={chapter.mode}
                        onChange={(event) => {setChapter({...chapter,mode:event.target.value})}}
                    >
                        <option value={"Private"}>Private</option>
                        <option value={"Public"}>Public</option>
                    </select>
                    </div>
                    <a href={"/create/" + storyID}><button className={"edit-chapter-input"}>
                        GO BACK
                    </button></a>
                </div>
                <div className={"container-div rightAlign"}>
                    <button className={"edit-chapter-input"} onClick={saveChapter}>
                        SAVE
                    </button>
                    <button className={"edit-chapter-input"} onClick={deleteChapter}>
                        DELETE
                    </button>
                    <button className={"edit-chapter-input"} onClick={()=>{console.log(chapter, chapterText)}}>
                        LOG
                    </button>
                </div>
            </div>
        <hr />
        <div className={"edit-chapter-editor-div"}>
            <div className="control-group">
                <div className="tiptap-button-list button-list row">
                    <button onClick={() => editor.chain().focus().toggleBold().run()} className={"tiptap-editor-button " + (editor.isActive('bold') ? 'is-active' : '')}>B</button>
                    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={"tiptap-editor-button " + (editor.isActive('italic') ? 'is-active' : '')}>I</button>
                    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={"tiptap-editor-button " + (editor.isActive('underline') ? 'is-active' : '')}>U</button>
                </div>
                <div className={"tiptap-info-list"}>
                    <p>{editor.storage.characterCount.words()} words</p>
                    <p>{editor.storage.characterCount.characters()} characters</p>
                </div>
            </div>
        </div>
        <div className={"editor-input-div"}>
            <EditorContent editor={editor} className={"editor-input"}/>
        </div>
    </div>)
}