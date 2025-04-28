import Head from "next/head";
import {useSession} from "next-auth/react";
import HomeBar from "@/components/HomeBar";
import Stories from "@/components/Stories";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";

export default function Index() {
    const { status, data: sessionData } = useSession();
    const [stories, setStories] = useState([])
    const [storyPopup, setStoryPopup] = useState(false);

    async function getStories() {
        const res = await axios.get(`api/stories?username=${sessionData.user.name}`)
        setStories(res.data.stories)
    }

    const createStory = async () => {
        const title = document.getElementById("story-title").value;
        const genre = document.getElementById("story-genre").value;
        const description = document.getElementById("story-description").value;
        const res = await axios.post(`api/stories`,{
            title: title,
            genre: genre,
            description: description,
            mode: "Private",
            tags: {}
        })
        if (res.data.status === 200){
            console.log("SUCCESS")
            setStoryPopup(false)
            await getStories()
        }
    }

    useEffect(() => {
        if (status !== "authenticated") {return}
        getStories()
    }, [status === "authenticated"]);

    if (status === "loading"){
        return <div>Loading...</div>
    }
    if (status === "unauthenticated"){
        return (<>
            <Head>
                <title>Create Story</title>
            </Head>
            <div>NOT AUTHENTICATED</div>
        </>)
    }

    console.log(stories)

    return (<>
        <Head>
            <title>Create Story</title>
        </Head>
        <HomeBar />
        <div className={"create-page"}>
            <h2>Create Page</h2>
            <div className={"button-list row"}>
                <Button
                    variant={"contained"}
                    onClick={() => setStoryPopup(!storyPopup)}
                >Create Story</Button>
                {storyPopup && (<div className={"create-story-popup-div"}>
                    <h2>Story Details</h2>
                    <TextField
                        id={"story-title"}
                        label={"Title"}
                        fullWidth
                    />
                    <TextField
                        id={"story-genre"}
                        label={"Genre"}
                    />
                    <TextField
                        id={"story-description"}
                        label={"Description"}
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                    />
                    <Button
                        variant={"contained"}
                        onClick={createStory}
                    >Create</Button>
                </div>)}
            </div>
            <div className={"stories-list"}>
                <h3>Your Stories</h3>
                {stories.map(story => <div key={story.id} className={"edit-story-div"}>
                    <span className={"story-title"}>{story.title}</span>
                    <div className={"edit-story-description"}>
                        {story.description}
                    </div>
                    <div className={"button-list row"}>
                        <a href={"/story/" + story.id}>VIEW</a>
                        <a href={"/create/" + story.id}>EDIT</a>
                    </div>
                </div>)}
            </div>
        </div>
    </>)
}