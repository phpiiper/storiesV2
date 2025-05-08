'use client'
import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState } from "react";
import axios from "axios";
import {useSession} from "next-auth/react";
import dayjs from 'dayjs'

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditChapter from "../../components/EditChapter";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";
import {useSnackbar} from "@/app/providers/snackbar";
import Confirmation from "@/app/components/Confirmation";


export default function StoryEditor() {
    const router = useRouter();
    const params = useParams()
    const {story: storyID } = params;
    const { status, data: sessionData } = useSession();
    const [story, setStory] = useState({})
    const [chapters, setChapters] = useState([])
    const [currentTab, setCurrentTab] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // SNACKBAR
    const {showSnackbar} = useSnackbar();
    async function getStory() {
        try {
            const storyData = await axios.get(`/api/stories?id=${storyID}`)
            if (!storyData.data) {return}
            setStory(storyData.data)
            const chaptersData = await axios.get(`/api/chapters?storyId=${storyID}`)
            setChapters(chaptersData.data)
            setIsLoading(false)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    }
    const parseDate = (date) => {
        return dayjs(date).format("MMMM D, YYYY |  h:mm:ss a")
    }
    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };
    const handleChangeStory = (event, field) => {
        setStory({...story,[field]:event.target.value})
    }
    const addStoryTag = () => {
        let elem = document.getElementById("story-tags-add")
        let value = elem.value.replaceAll(" ","-").toLowerCase();
        elem.value = "";
        // validate only a-z + -
        if (!value.match(/^[a-z-]+$/)) {
            showSnackbar("Tag can only be a-z and hyphens. No special characters allowed.")
            return
        }
        if (story.tags && story.tags.includes(value)) {
            showSnackbar("Tag already exists.")
            return
        }
        setStory({...story,tags:story.tags ? [...story.tags,value] : [value]})
    }
    const deleteStoryTag = (tag) => {
        setStory({...story,tags:story.tags.filter(x => x !== tag)})
    }

    // PERMANENT CHANGES
    const deleteChapter = async (id) => {
        const chapterFileName = chapters.find(x => x.id === id).file;
        const res = await axios.delete(`/api/chapters?storyID=${story.id}&chapterID=${id}&chapterFileName=${chapterFileName}`)
        console.log(res)
        if (res.data.status >= 300) {
            showSnackbar("Error in deleting chapter.","error")
            return false
        }
        showSnackbar("Chapter deleted successfully!","success")
        getStory()
        return true
    }
    const saveStory = async () => {
        const res = await axios.put(`/api/stories`,story)
        if (res.data.status === 200){
            showSnackbar("Story saved successfully!")
            return true
        } else {
            showSnackbar("Error saving story.")
            return false
        }
    }
    const addChapter = async () => {
        let blob = new Blob(["This is the beginning of the chapter..."], { type: "text/markdown" });
        const file = new File([blob], `${story.id}-upload.md`, { type: "text/markdown" });
        // then send through api
        const formData = new FormData();
            formData.append("storyId",story.id)
            formData.append("chapterName","New Chapter")
            formData.append("chapterMode","Public")
            formData.append('file', file);
        const res = await axios.post(`/api/chapters`,formData);
        if (res.data){
            showSnackbar("New chapter added!","success")
            getStory()
            return true
        } else {
            showSnackbar("Error in creating chapter.")
            return false
        }
    }

    useEffect(() => {
        if (status !== "authenticated" || !storyID) {return}
        getStory()
    }, [storyID,status]);

    if (isLoading){
        return (<>
            <LoadingDiv />
        </>)
    }

    if (status === "unauthenticated" ||isError ||(sessionData && story.user_id !== sessionData.user.id)){
        return (<>
            <ErrorPage error={404} msg={isError ? "ERROR FETCHING STORY" : "NOT AUTHENTICATED"}></ErrorPage>
        </>)
    }

    return (<div className={"page story-editor-page"}>
        <div className={"flex"}>
            <label htmlFor={"story-title"}><EditRoundedIcon /></label>
            <input
                className={"edit-story-input"}
                id={"story-title"}
                value={story.title}
                onChange={(event) => {handleChangeStory(event,"title")}}
                placeholder={"Story Title"}
            />
        </div>
        <div className={"container row"}>
            <div className={"container-div flex row"}>
                <label htmlFor={"story-genre"}><EditRoundedIcon /></label>
                <input
                    className={"edit-story-input"}
                    id={"story-genre"}
                    value={story.genre}
                    onChange={(event) => {handleChangeStory(event,"genre")}}
                    placeholder={"Genre"}
                />
            </div>
            <div className={"container-div flex"} style={{alignItems: "flex-end", display: "flex"}}>
                <button>SAVE</button>
            </div>
        </div>
        <div className={"container row"}>
            <div className={"container-div flex row"} >
                <label htmlFor={"story-mode"}><EditRoundedIcon /></label>
                <select
                    className={"edit-chapter-input"}
                    id={"story-mode"}
                    value={story.mode}
                    onChange={(event) => {setStory({...story,mode:event.target.value})}}
                >
                    <option value={"Private"}>Private</option>
                    <option value={"Public"}>Public</option>
                </select>
            </div>
            <div className={"container-div flex row"} style={{display: "flex", justifyContent: "flex-end"}}>
                <a href={"/create"}><button>GO BACK</button></a>
            </div>
        </div>
        <hr style={{width: "100%", margin: "0.5rem 0"}}/>
        <div className={"flex"} style={{gap: "1rem", fontSize: "0.75rem"}}>
            <div className={"container-div flex row"} >
                <span>LAST UPDATED</span>
            </div>
            <div className={"container-div flex row"} style={{display: "flex", justifyContent: "flex-end"}}>
                <span>{parseDate(story.last_updated)}</span>
            </div>
        </div>
        <div className={"flex"} style={{gap: "1rem", fontSize: "0.75rem"}}>
            <div className={"container-div flex row"} >
                <span>CREATE DATE</span>
            </div>
            <div className={"container-div flex row"} style={{display: "flex", justifyContent: "flex-end"}}>
                <span>{parseDate(story.create_date)}</span>
            </div>
        </div>
        <div style={{margin: "1rem 0"}} />
        <div className={"edit-story-tab-div"}>
            <div className={"edit-story-info tab-content"}>
                <span className={"span-header"} style={{fontSize: "1.25rem", justifyContent: "left", margin:"0", gap:"0.25rem" }}>Description</span>
                <textarea
                    id={"story-description"}
                    value={story.description}
                    onChange={(event) => {handleChangeStory(event,"description")}}
                    placeholder={"Description"}
                />
            </div>
        </div>
        <div className={"flex"} style={{gap: "1rem", fontSize: "0.75rem"}}>
            <div className={"container-div flex row"} >
                <span className={"span-header"} style={{fontSize: "1.25rem", justifyContent: "left", margin:"0", gap:"0.25rem" }}>Tags</span>
            </div>
            <div className={"container-div flex row"} style={{display: "flex", justifyContent: "flex-end"}}>
                <input
                    className={"edit-chapter-input edit-story-tags-input"}
                    placeholder={"Add Tag + (Enter)"}
                    onKeyUp={(event)=>{if (event.key === "Enter") {addStoryTag()}}}
                    id={"story-tags-add"}
                    style={{textAlign: "right"}}
                />
            </div>
        </div>
        <div className={"story-tags-container"} style={{marginBottom: "2rem"}}>
            {story.tags && story.tags.map((value, index) => <a
                    key={`tag-${value}`}
                    onClick={() => {deleteStoryTag(value)}}
                >{`${value}`}</a>
            )}
        </div>
        <div className={"flex"} style={{gap: "1rem", fontSize: "0.75rem"}}>
            <div className={"container-div flex row"} >
                <span className={"span-header"} style={{fontSize: "1.25rem", justifyContent: "left", margin:"0", gap:"0.25rem" }}>Chapters</span>
            </div>
            <div className={"container-div flex row"} style={{display: "flex", justifyContent: "flex-end"}}>
                <Confirmation
                    text={"Are you sure you want to add a chapter?"}
                    onConfirm={addChapter}
                >
                    <a><button>Add Chapter</button></a>
                </Confirmation>
            </div>
        </div>
        <div className={"edit-story-info tab-content"}>
            <div className={"chapters-list"}>
                <div className={"edit-chapter-div"}>
                    <a>#</a>
                    <a>Chapter Name</a>
                    <div
                        className={"button-list row"}
                        style={{marginLeft: "auto"}}
                    >
                        <a className={"box-icon-header-a"}>C1</a>
                        <a className={"box-icon-header-a"}>C2</a>
                        <a className={"box-icon-header-a"}>C3</a>
                        <a className={"box-icon-header-a"}>C4</a>
                    </div>
                </div>
                <hr />
                {chapters ? chapters.map((value, index) => (
                    <EditChapter key={`chapter-${index}`} chapters={chapters} setChapters={setChapters} chapterID={value.id} funcs={{
                        deleteChapter: deleteChapter
                    }}/>
                )) : <></>}
            </div>
        </div>


    </div>)


}