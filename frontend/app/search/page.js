'use client'
import HomeBar from "../components/HomeBar";
import {useSearchParams} from "next/navigation";

export default function Search() {
    const searchParams = useSearchParams()
    const title = searchParams.get("title")
    const genre = searchParams.get("genre")
    const tags = searchParams.get("tags")
    return (<><HomeBar /><div id={"search-page"}>
        <h1>Search</h1>
        <p>Will be implemented soon</p>
        <p>Will use queries to filter stories</p>
            <h2>Queries</h2>
            <p>Title: {title}</p>
            <p>Genre: {genre}</p>
            <p>Tags: {Array.isArray(tags) ? tags.join(", ") : tags}</p>
    </div></>)
}