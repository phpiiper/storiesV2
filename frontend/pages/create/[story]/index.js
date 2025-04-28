import { useRouter } from 'next/router';
import {useEffect, useState } from "react";
import axios from "axios";
import HomeBar from "@/components/HomeBar";
import {useSession} from "next-auth/react";
import Head from "next/head";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import EditChapter from "@/components/EditChapter";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";



export default function StoryEditor() {
    const router = useRouter();
    const {story: storyID } = router.query;
    const { status, data: sessionData } = useSession();
    const [story, setStory] = useState({})
    const [chapters, setChapters] = useState([])
    const [currentTab, setCurrentTab] = useState(1);
    async function getStory() {
        try {
            const storyData = await axios.get(`/api/stories?id=${storyID}`)
            if (!storyData.data) {return}
            setStory(storyData.data)
            const chaptersData = await axios.get(`/api/chapters?storyId=${storyID}`)
            setChapters(chaptersData.data.chapters)
            console.log(chaptersData)
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
    const addStoryTag = (event) => {
        let value = event.target.value;
        setStory({...story,tags:story.tags ? [...story.tags,value] : [value]})
    }
    const deleteStoryTag = (tag) => {
        setStory({...story,tags:story.tags.filter(x => x !== tag)})
    }

    // PERMANENT CHANGES
    const deleteChapter = async (id) => {
        console.log("delete chapter", id)
        const res = await axios.delete(`/api/chapters?storyID=${story.id}&chapterID=${id}`)
        getStory()
        console.log(res.data)
    }
    const saveStory = async () => {
        console.log("SAVE STORY",story)
        const res = await axios.put(`/api/stories`,story)
        if (res.data.status === 200){
            console.log("SUCCESS")
        } else {
            console.log("ERROR")
        }
    }
    const addChapter = async () => {
        console.log("ADD CHAPTER")
        const chapterID = story.id + "-" + (chapters.length + 1); // FIX THIS LATER
        // create empty file
        let blob = new Blob(["This is the beginning of the chapter..."], { type: "text/markdown" });
        const file = new File([blob], `${chapterID}.md`, { type: "text/markdown" });
        // then send through api
        const formData = new FormData();
            formData.append("storyID",story.id)
            formData.append("chapterID",chapterID)
            formData.append("chapterName","New Chapter")
            formData.append("chapterMode","Public")
            formData.append('file', file);
        const res = await axios.post(`/api/chapters`,formData);
        if (res.data){
            console.log(res.data)
            console.log("SUCCESS")
            getStory()
        } else {
            console.log("ERROR")
        }
    }

    useEffect(() => {
        if (status !== "authenticated" || !router.isReady) {return}
        getStory()
    }, [router.isReady,status === "authenticated"]);

    if (status === "loading"){
        return <div>Loading...</div>
    }
    if (status === "unauthenticated" || (story && story.user_id !== sessionData.user.id)){
        return (<>
            <Head>
                <title>Edit Story</title>
            </Head>
            <div>
                <span>NOT AUTHENTICATED</span>
            </div>
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
                                    if (story.tags.includes(event.target.value)){ console.log("ERROR"); return }
                                    addStoryTag(event); event.target.value ="";
                                }}}
                            fullWidth
                        />
                        <Button
                            variant={"contained"}
                            onClick={(event) => {addStoryTag(event)}}
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