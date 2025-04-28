import Chip from '@mui/material/Chip';
import HomeBar from "@/components/HomeBar";

export default function Story({story}) {
    if (!story){
        return (<>
        <div
            className={"error-div"}
        >
            LOADING
        </div></>)
    }
    return (<div className={"story-div"}>
        <div className={"top"}>
            <span className={"title"}>{story.title}</span>
            <Chip
                label={story.genre}
                component={"a"}
                href={`/search?genre=${story.genre}`}
                clickable
            />
        </div>
        <div className={"body"}>
            {story.description}
        </div>
        <div className={"bottom"}>
            <a href={`story/${story.id}/1`}>Read</a>
            <a href={"story/" + story.id}>Info</a>
        </div>
    </div>)
}