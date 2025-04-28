import Story from "@/components/Story";


export default function Stories({stories=[], status}) {
    console.log(stories)
    if (!status){
        return (<div>Loading...</div>)
    }
    return (<div className={"story-list"}>
        {stories.map(story =>
            <Story story={story} key={story.id} />)}
    </div>)
}