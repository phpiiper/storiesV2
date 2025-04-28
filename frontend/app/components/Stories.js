import Story from "./Story";
import LoadingDiv from "@/app/components/LoadingDiv";


export default function Stories({name="Stories",stories=[], status}) {
    if (!status || stories.length === 0){
        return <LoadingDiv />
    }
    return (<>
        <h2>{name}</h2>
        <div className={"story-list"}>
        {stories.map(story =>
            <Story story={story} key={story.id} />)}
    </div></>)
}