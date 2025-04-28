import { useRouter } from 'next/router';
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import HomeBar from "@/components/HomeBar";
import Markdown from 'react-markdown'
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsPopup from "@/components/SettingsPopup";



export default function ChapterPage() {
    const router = useRouter();
    const { story: storyID, chapter: chapterID } = router.query;

    const [storyObj, setStoryObj] = useState({});
    const [chaptersObj, setChaptersObj] = useState({});
    const [chapter, setChapter] = useState({});
    const [chapterFile, setChapterFile] = useState(undefined);
    const [preferences, setPreferences] = useState({
        fontSize: 18, fontFamily: "EB Garamond", lineHeight: 1.5, pagePadding: 5, alignText: "Left",
    })
    const [openSettings, setOpenSettings] = useState(false);
    const chapterBodyRef = useRef(null);

    useEffect(() => {
        if (!router.isReady) {return}
        async function getData() {
        try {
            const storyObj = await axios.get(`/api/stories/?id=${storyID}`)
            const story = storyObj.data;
            const chaptersObj = await axios.get(`/api/chapters?storyId=${storyID}`)
                const chapters = chaptersObj.data;
                setStoryObj(story)
                setChaptersObj(chapters.chapters)
                const ch = chapters.chapters[chapterID-1]
                    ch.index = chapterID-1
                setChapter(ch)
                const chapterFile = await axios.get(`/api/chapters?fileName=${ch.file}`)
            const chapterFileData = chapterFile.data;
                setChapterFile(chapterFileData.chapter)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
        }
        getData()
    },[router.isReady])

    useEffect(() => {
    const elem = chapterBodyRef.current;
    if (!elem) {return}
        elem.style.fontSize = preferences.fontSize + "px";
        elem.style.fontFamily = preferences.fontFamily;
        elem.style.lineHeight = preferences.lineHeight;
        elem.style.padding = `0 ${preferences.pagePadding}%`;
        elem.style.textAlign = preferences.alignText;
    }, [chapterBodyRef.current,preferences])

    if (!storyObj || Object.keys(storyObj).length === 0){
        return (<>
            <HomeBar />
            <div>LOADING...</div>
            </>)
    }

    if (!storyObj){
        return (<>
            <HomeBar />
            <div>Story Does Not Exist</div>
        </>)
    }

    if (!chapter || Object.keys(chapter).length === 0){
        return (<>
            <HomeBar />
            <div>Chapter Does Not Exist</div>
    </>)
    }


    console.log(chaptersObj,chapter)

    return (<>
        <HomeBar />
        <div id={"main-content"} style={{
            padding: "1rem 0"
        }}>
            <div
                className={"chapter-page"}
                onClick={() => {
                    if (openSettings){
                        setOpenSettings(false)
                    }
                }}
            >
                <h1 className={"chapter-name"}>{chapter.name}</h1>
                <a href={`/story/${storyObj.id}`} className={"story-name"}>{storyObj.title}</a>
                <div className={"chapter-body"} ref={chapterBodyRef}>
                    {chapterFile ? <Markdown>{chapterFile.chapter}</Markdown> : "Loading..."}
                </div>
            </div>
            <div className={"chapter-footer-buttons ui-elem"}>
                {chapter.index > 0 ? (
                    <a href={`/story/${storyObj.id}/${chapter.index}`}>PREVIOUS</a>
                ) : null}

                <a href={`/story/${storyObj.id}`}>Title Page</a>

                {chapter.index + 1 < chaptersObj.length ? (
                    <a href={`/story/${storyObj.id}/${chapter.index + 2}`}>NEXT</a>
                ) : null}
            </div>

            <div className={"settings-nav"}>
                {openSettings ? <SettingsPopup preferences={preferences} setPreferences={setPreferences}/> : <></>}
                <button
                    className={`button ${openSettings ? "active" : ""}`}
                    onClick={() => setOpenSettings(!openSettings)}
                >
                    <SettingsIcon className={"icon"}/>
                </button>
            </div>
        </div>
    </>);
}
