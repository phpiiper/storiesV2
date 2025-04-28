import { useRouter } from 'next/router';
import {useEffect, useState} from "react";
import Chip from '@mui/material/Chip';
import HomeBar from "@/components/HomeBar";

export default function Story() {
    const router = useRouter();
    const [story, setStory] = useState({});
    const [chapters, setChapters] = useState([]);
    const [author, setAuthor] = useState({});
    useEffect(() => {
        async function getStory() {
            if (!router.isReady) {return}

            const res = await fetch(`/api/stories?id=${router.query.story}`);
            if (res.ok) {
                const json = await res.json();
                setStory(json);
                const ch_res = await fetch(`/api/chapters?storyId=${router.query.story}`);
                const ch_json = await ch_res.json();
                setChapters(ch_json.chapters);
                const user_res = await fetch(`/api/users?id=${json.user_id}`);
                const user_json = await user_res.json();
                setAuthor(user_json ? user_json.user : "Unknown");
            } else {
                console.log("Error fetching story");
                setStory(undefined)
            }
        }
        getStory();
    },[router.isReady])

    // console.log(story,chapters,author);
console.log(chapters[0]);
    if (story === {}){
        return (<>
            <HomeBar />
            <div>Loading...</div>
        </>)
    }
    if (!story){
        return (<>
        <HomeBar />
        <div>Story Doesn't Exist</div>
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
