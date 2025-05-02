'use client'
import {useEffect, useState} from "react";
import Chip from '@mui/material/Chip';
import HomeBar from "../../components/HomeBar";
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import LoadingDiv from "@/app/components/LoadingDiv";
import axios from "axios";
import ErrorPage from "@/app/components/ErrorPage";

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
            <HomeBar />
            <ErrorPage></ErrorPage>
        </>)
    }

    if (isLoading){
        return (<>
            <HomeBar />
            <LoadingDiv />
        </>)
    }

    return (<>
            <HomeBar />
            <div id={"content"} className={"story-info-page"}>
                <span className={"story-author"}>{author.username}</span>
                <span className={"story-title"}>{story.title}</span>
                <Chip
                    label={story.genre}
                    component={"a"}
                    href={`/search?genre=${story.genre}`}
                    clickable
                />
                <div className={"story-description"}>
                    {story.description}
                </div>
                <div className={"story-tags"}>
                    <hr />
                    <span className={"span-header"}>Tags</span>
                    <div className={"story-tags-list"}>{story.tags?.map(x => (<Chip
                        key={story.id + "-" + x}
                        label={x}
                        component={"a"}
                        href={`/search?tag=${x}`}
                        clickable
                    />))}</div>
                </div>
                <div className={"story-toc"}>
                    <hr />
                    <span className={"span-header"}>Table of Contents</span>
                    <div className={"story-toc-list"}>
                        {chapters ? (
                            chapters.map((value, index) => (
                                    <a key={"ch-"+index+1} href={`/story/${story.id}/${index+1}`}>{value.name}</a>
                                )
                            )) : <></>}
                    </div>
                </div>
            </div>
        </>
    );
}
