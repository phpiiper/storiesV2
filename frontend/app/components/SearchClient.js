'use client'
import { useSearchParams } from 'next/navigation';

export default function SearchClient() {
    const searchParams = useSearchParams()
    const title = searchParams.get("title")
    const genre = searchParams.get("genre")
    const tags = searchParams.get("tags")

    return (
        <div id="search-page">
            <h1>Search</h1>
            <p>Will be implemented soon</p>
            <p>Will use queries to filter stories</p>
            <h2>Queries</h2>
            <p>Title: {title}</p>
            <p>Genre: {genre}</p>
            <p>Tags: {Array.isArray(tags) ? tags.join(", ") : tags}</p>
        </div>
    );
}
