'use client'
import {useSession} from "next-auth/react";
import HomeBar from "../components/HomeBar";
import {useEffect, useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";

export default function Index() {
    const { status, data: sessionData } = useSession();
    const [stories, setStories] = useState([])
    const [storyPopup, setStoryPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    async function getStories() {
        const res = await axios.get(`api/stories?username=${sessionData.user.name}`)
        setStories(res.data)
        setIsLoading(false)
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
        if (status === "loading") {return}
        getStories()
    }, [status]);


    if (status === "unauthenticated" || isError){
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





    // console.log(stories)

    return (<>
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