'use client'
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import axios from "axios";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

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
            <ErrorPage error={404} msg={isError ? "ERROR FETCHING STORY" : "NOT AUTHENTICATED"}></ErrorPage>
        </>)
    }

    if (isLoading){
        return (<>
            <LoadingDiv />
        </>)
    }


    return (<div className={"page create-page"}>
        <h1 className={"page-header"}>CREATE</h1>
        <div className={"container row"}>
            <div className={"container-div"}>
                <button
                    onClick={() => setStoryPopup(!storyPopup)}
                >Create Story</button>
                {storyPopup && (<div className={"create-story-popup-div"}>
                    <button onClick={() => setStoryPopup(false)}><a>Close</a></button>
                    <h2>Story Details</h2>
                    <div className={"flex row"}>
                        <label htmlFor={"story-title"}>Title</label>
                        <input
                            style={{padding: "0"}}
                            className={"edit-chapter-input"} id={"story-title"} type={"text"} placeholder={"Title"} />
                    </div>
                    <div className={"flex row"}>
                        <label htmlFor={"story-genre"}>Genre</label>
                        <input
                            style={{padding: "0"}}
                            className={"edit-chapter-input"} id={"story-genre"} type={"text"} placeholder={"Genre"} />
                    </div>
                    <div className={"flex row"}>
                        <label htmlFor={"story-description"}>Description</label>
                        <input
                            style={{padding: "0"}}
                            className={"edit-chapter-input"} id={"story-description"} type={"text"} placeholder={"A short description about this story. A line or so."} />
                    </div>
                    <button
                        onClick={createStory}
                        style={{marginTop: "auto"}}
                    >Create Story</button>
                    </div>)}
                <a href={"/"} style={{width: "fit-content"}}><button>Go Back</button></a>
            </div>
        </div>
        <h2>Your Stories</h2>
        <hr />
        <div className={"container"}  style={{
            gap: "1rem",
            height: "auto",
        }}><div className={"create-story-div"}>
            <span className={"index"}>#</span>
            <span className={"title"}>Title</span>
            <div className={"button-list row"}>
                <a className="box-icon-header-a" style={{color: "inherit !important"}}>C1</a>
                <a className="box-icon-header-a" style={{color: "inherit !important"}}>C2</a>
            </div>
        </div>
            {stories && stories.map((value, index) => <div key={value.id} className={"create-story-div"}>
                <span className={"index"}>{index+1}</span>
                <span className={"title"}>{value.title}</span>
                <div className={"button-list row"}>
                    <a className="box-icon-button" href={`/story/${value.id}`}><button><VisibilityIcon /></button></a>
                    <a className="box-icon-button" href={`/create/${value.id}`}><button><EditIcon /></button></a>
                </div>
            </div>)}
        </div>
    </div>)

}