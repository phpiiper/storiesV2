'use client'
import { useRouter } from 'next/navigation';
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "../../../components/HomeBar";
import Markdown from 'react-markdown'
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsPopup from "../../../components/SettingsPopup";
import {useParams} from "next/navigation";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";



export default function ChapterPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const { story: storyID, chapter: chapterID } = params;

    const [storyObj, setStoryObj] = useState({});
    const [chaptersObj, setChaptersObj] = useState({});
    const [chapter, setChapter] = useState({});
    const [chapterFile, setChapterFile] = useState(undefined);
    const [preferenceOptions, setPreferenceOptions] = useState({
        lineHeight: [1,1.15,1.5,2],
        alignText: ["Left","Justify","Center","Right"],
        fontFamily: ["EB Garamond","Libre Baskerville","Ysabeau","Noto Sans","Calibri"],
        fontSizeMin: 10, fontSizeMax: 40
    })
    const [preferences, setPreferences] = useState({
        fontSize: 18, fontFamily: "EB Garamond", lineHeight: 1.5, pagePadding: 5, alignText: "Left",
    })
    const [openSettings, setOpenSettings] = useState(false);
    const chapterBodyRef = useRef(null);

    useEffect(() => {
        if (!storyID) {return}
        async function getData() {
            try {
                const storyObj = await axios.get(`/api/stories/?id=${storyID}`)
                const story = storyObj.data;
                const chaptersObj = await axios.get(`/api/chapters?storyId=${storyID}`)
                const chapters = chaptersObj.data;
                setStoryObj(story)
                setChaptersObj(chapters)
                let c_id = typeof chapterID === "string" ? parseInt(chapterID) : chapterID;
                let ch = chapters[c_id-1]
                ch.index = c_id-1
                setChapter(ch)
                const chapterFile = await axios.get(`/api/chapters?fileName=${ch.file}`)
                const chapterFileData = chapterFile.data;
                setChapterFile(chapterFileData)
                setIsLoading(false)
            } catch (e) {
                console.log(`Error: ${e}`)
                setIsError(true)
            }
        }
        getData()
    },[!storyID])

    useEffect(() => {
        const elem = chapterBodyRef.current;
        if (!elem) {return}
        elem.style.fontSize = preferences.fontSize + "px";
        elem.style.fontFamily = preferences.fontFamily;
        elem.style.lineHeight = preferences.lineHeight;
        elem.style.paddingLeft = `${preferences.pagePadding}%`;
        elem.style.paddingRight = `${preferences.pagePadding}%`;
        elem.style.textAlign = preferences.alignText;
    }, [chapterBodyRef.current,preferences,chapterFile])

    if (isLoading) {
        return (<>
            <LoadingDiv />
        </>)
    }

    if (isError){
        return (<>
            <ErrorPage></ErrorPage>
        </>)
    }

console.log(chapter.index)

    return (<>
        <div className={"chapter-page page"}>
            <a href={"/"}>Homepage</a>
            <h1 style={{marginLeft: "-4px"}}>{chapter.name}</h1>
            <a href={`/story/${storyObj.id}`} style={{
                fontSize: "0.9rem"
            }}>{storyObj.title}</a>
            <div className={"chapter-body"} ref={chapterBodyRef}>
                {chapterFile ? <Markdown>{chapterFile}</Markdown> : <LoadingDiv />}
                <div className={"chapter-footer"}>
                    <hr />
                    <div className={"button-list row"}>
                        {chapter.index !== 0 && <a href={chapter.index}>PREVIOUS</a>}
                        {chapter.index < chaptersObj.length - 1 && <a href={chapter.index+2}>NEXT</a>}
                    </div>
                </div>
            </div>
        </div>
    </>)

}
