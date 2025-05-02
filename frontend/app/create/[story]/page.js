'use client'
import {useParams, useRouter} from 'next/navigation';
import {useEffect, useState } from "react";
import axios from "axios";
import {useSession} from "next-auth/react";
import Head from "next/head";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EditChapter from "../../components/EditChapter";
import HomeBar from "../../components/HomeBar";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";
import {useSnackbar} from "@/app/providers/snackbar";



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
        if (res.data.status !== 200) {
            showSnackbar("Error in deleting chapter.")
            return
        }
        showSnackbar("Chapter deleted successfully!")
        getStory()
    }
    const saveStory = async () => {
        const res = await axios.put(`/api/stories`,story)
        if (res.data.status === 200){
            showSnackbar("Story saved successfully!")
        } else {
            showSnackbar("Error saving story.")
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
            showSnackbar("New chapter added!")
            getStory()
        } else {
            showSnackbar("Error in creating chapter.")
        }
    }

    useEffect(() => {
        if (status !== "authenticated" || !storyID) {return}
        getStory()
    }, [storyID,status]);

    if (isLoading){
        return (<>
            <HomeBar />
            <LoadingDiv />
        </>)
    }

    if (status === "unauthenticated" ||isError ||(sessionData && story.user_id !== sessionData.user.id)){
        return (<>
            <HomeBar />
            <ErrorPage error={404} msg={isError ? "ERROR FETCHING STORY" : "NOT AUTHENTICATED"}></ErrorPage>
        </>)
    }


    return (<>
        <HomeBar />
        <div className={"story-editor-page"}>
            <h1 style={{textAlign: "center", margin: "1rem 0"}}>EDIT STORY</h1>
            <Button
                variant={"contained"}
                href={"/create"}
            >GO BACK</Button>
            <Tabs value={currentTab} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab value={1} label={"Basic Info"} />
                <Tab value={2} label={"Tags"} />
                <Tab value={3} label={"Chapters"} />
            </Tabs>
            <div
                className={"tab edit-story-tab"}
                role={"tabpanel"}  hidden={currentTab !== 1}
                id={"simple-tabpanel-1"} aria-labelledby={`simple-tab-1`}
            >
                <div className={"edit-story-info tab-content"}>
                    <TextField
                        id={"story-title"}
                        label={"Title"}
                        value={story.title}
                        onChange={(event) => {handleChangeStory(event,"title")}}
                        fullWidth
                    />
                    <TextField
                        id={"story-genre"}
                        label={"Genre"}
                        value={story.genre}
                        onChange={(event) => {handleChangeStory(event,"genre")}}
                        fullWidth
                    />
                    <TextField
                        id={"story-description"}
                        label={"Description"}
                        value={story.description}
                        onChange={(event) => {handleChangeStory(event,"description")}}
                        multiline
                        fullWidth
                        minRows={4}
                        maxRows={8}
                    />
                    <Select
                        id={"story-mode"}
                        label={"Mode"}
                        value={story.mode}
                        onChange={(event) => {handleChangeStory(event,"mode")}}
                    >
                        <MenuItem value={"Private"}>Private</MenuItem>
                        <MenuItem value={"Public"}>Public</MenuItem>
                    </Select>
                </div>
            </div>
            <div
                className={"tab edit-story-tab"}
                role={"tabpanel"}  hidden={currentTab !== 2}
                id={"simple-tabpanel-2"} aria-labelledby={`simple-tab-2`}
            >
                <div className={"tab-content"}>
                    <div className={"flex"} style={{margin: "1rem 0"}}>
                        <TextField
                            id={"story-tags-add"}
                            label={"Add Tag"}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    addStoryTag(event);
                                }}}
                            fullWidth
                        />
                        <Button
                            variant={"contained"}
                            onClick={addStoryTag}
                        >ADD</Button>
                    </div>
                    <p>Add tags to better define the story. Only alphabetical characters and hyphens are allowed.</p>
                    <span className={"text-header"}>Tag List</span>
                    <div className={"tags-list"}>
                        {story.tags ? story.tags.map(x =>
                            <Chip
                                key={`tag-${x}`}
                                label={x}
                                onDelete={() => {deleteStoryTag(x)}}
                            />
                        ) : <></>}
                    </div>
                </div>
                </div>
            <div
                className={"tab edit-story-tab"}
                role={"tabpanel"}  hidden={currentTab !== 3}
                id={"simple-tabpanel-3"} aria-labelledby={`simple-tab-3`}
            >
                <div className={"tab-content"}>
                    <Button
                        variant={"contained"}
                        fullWidth
                        onClick={addChapter}>Add Chapter</Button>
                    <div className={"chapters-list"}>
                        {chapters ? chapters.map((value, index) => (
                            <EditChapter key={`chapter-${index}`} chapters={chapters} setChapters={setChapters} chapterID={value.id} funcs={{
                                deleteChapter: deleteChapter
                            }}/>
                        )) : <></>}
                    </div>

                </div>
        </div>
            {currentTab !== 3 && <div className={"edit-story-footer"}>
                <Button
                    variant={"contained"}
                    onClick={saveStory}>SAVE
                </Button>
                <p>Changes will not save unless you press SAVE</p>
            </div>}

        </div>
    </>)
}