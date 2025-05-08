import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import Confirmation from "../components/Confirmation";

export default function EditChapter({funcs, chapters, chapterID}) {
    const chInd = chapters.findIndex(x => x.id === chapterID)
    const ch = chapters[chInd]

    return(<><div className={"edit-chapter-div"} key={"ch-"+chapterID}>
        <span>{chInd+1}</span>
        <span>{ch.name}</span>
        <div
            className={"button-list row"}
            style={{marginLeft: "auto"}}
        >
            <a className="box-icon-button" href={`/story/${ch.story_id}/${chInd+1}`}><button><VisibilityIcon /></button></a>
            <a className="box-icon-button" href={`/create/${ch.story_id}/${chapters.findIndex(x => x.id === chapterID)+1}`}><button><EditIcon /></button></a>
            {process.env.NODE_ENV === "development" && <a className="box-icon-button" onClick={()=> console.log(ch)}><button><CodeIcon /></button></a>}
            <Confirmation
                text={"Are you sure you want to delete this chapter?"}
                onConfirm={() => {funcs.deleteChapter(ch.id)}}
            >
                <a className={"box-icon-button"}><button><DeleteIcon /></button></a>
            </Confirmation>
        </div>
    </div>
    </>
    )
}

/*

            <button color={"error"} variant={"contained"} onClick={() => {funcs.deleteChapter(ch.id)}}>DELETE</button>
            <button className={"button-a"} variant={"contained"} href={`/create/${ch.story_id}/${chapters.findIndex(x => x.id === chapterID)+1}`}>EDIT</button>
            {process.env.NODE_ENV === "development" && <button variant={"contained"} color={"secondary"} onClick={() => {
                console.log(ch)
            }}>Log File</button>}
 */