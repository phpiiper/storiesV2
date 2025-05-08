'use client'
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import LoadingDiv from "@/app/components/LoadingDiv";
import axios from "axios";
import ErrorPage from "@/app/components/ErrorPage";
import dayjs from "dayjs";
import CheckIcon from '@mui/icons-material/Check';

export default function Story() {
    const router = useRouter();
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [story, setStory] = useState({});
    const [chapters, setChapters] = useState([]);
    const [author, setAuthor] = useState({});
    useEffect(() => {
        async function getStory() {
            if (!params.story) {return}
            const storyId = params.story

            const res = await fetch(`/api/stories?id=${storyId}`);
            if (res.ok) {
                const json = await res.json();
                setStory(json);
                const ch_res = await axios.get(`/api/chapters?storyId=${storyId}`);
                const ch_json = ch_res.data
                setChapters(ch_json);
                const user_res = await axios.get(`/api/user?id=${json.user_id}`);
                const user_json = await user_res.data;
                setAuthor(user_json ? user_json.user : "Unknown");
                setIsLoading(false);
            } else {
                console.log("Error fetching story");
                setStory(undefined)
                setIsError(true)
            }
        }
        getStory();
    },[params.story]);

    if (isError){
        return (<>
            <ErrorPage></ErrorPage>
        </>)
    }

    if (isLoading){
        return (<>
            <LoadingDiv />
        </>)
    }

//    console.log(story)

    return (<>
        <div className={"story-info-page page"}>
            <a href={"/"} style={{textDecoration: "underline"}}><span>Return</span></a>
            <div className={"container row"}>
                <div className={"container-div left"}>
                    <span className={"story-info-header"}>AUTHOR</span>
                    <span className={"story-info-value"}>{author.username}</span>
                </div>
                <div className={"container-div rightAlign"}>
                    <h2>{story.title}</h2>
                </div>
            </div>
            <div className={"container row"}>
                <div className={"container-div left"}>
                </div>
                <div className={"container-div rightAlign row"} style={{gap: "0.5rem"}}>
                    <span className={"story-info-header"}>ID</span>
                    <span className={"story-info-value"}>{story.id.split("-")[0]}...</span>
                </div>
            </div>
            <div className={"container row"}>
                <div className={"container-div left"}>
                    TAGS
                </div>
                <div className={"container-div rightAlign row"} style={{gap: "0.5rem"}}>
                    <span className={"story-info-header"}> UPDATED</span>
                    <span className={"story-info-value"}>{dayjs(story.last_updated).format("MMMM D, YYYY")}</span>
                </div>
            </div>
            <div className={"container row"} style={{marginBottom: "2rem"}}>
                <div className={"container-div left"}>
                    {story.tags.map((value, index) => index < 3 ? <div className={"tag-chip"} style={{fontSize: "0.8rem"}} key={`tag-${value}`}>{value} </div> : <></>  )}
                    {story.tags.length > 3 && <div className={"tag-chip"}>...</div>}
                </div>
                <div
                    className={"container-div rightAlign row"}
                >
                    {story.tags.length > 3 && <button
                        onClick={() =>{
                            alert("Will be added soon!")
                        }}
                    >View Tags</button>}
                </div>
            </div>
            <div className={"story-info-chapters-div"}>
                <div className={"story-info-chapter"}>
                    <div className={"id"}>#</div>
                    <div className={"title"}>Chapter Name</div>
                    <div className={"read"}>Read</div>
                </div>
            </div>
            <hr style={{width: "100%", margin: "0 0 1rem"}}/>
            {chapters.map((value, index) => <div
                className={"story-info-chapters-div"}
                key={value.id}
            >
                <div className={"story-info-chapter"}>
                    <div className={"id"}>{index+1}</div>
                    <div className={"title"}>{value.name}</div>
                    <div className={"read"}><a
                        href={`/story/${value.story_id}/${index+1}`}
                        className={"hover-reveal box-icon-button"}
                    ><button><CheckIcon /></button></a></div>
                </div>
            </div>)}
        </div>
    </>)

}
