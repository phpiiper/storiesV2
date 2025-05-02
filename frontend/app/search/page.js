import HomeBar from "../components/HomeBar";
import { Suspense } from 'react'
import SearchClient from "@/app/components/SearchClient";

export default function Search() {
    return (<><HomeBar />
    <Suspense>
    <SearchClient />
    </Suspense></>)
}