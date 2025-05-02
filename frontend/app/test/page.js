'use client'
import HomeBar from "@/app/components/HomeBar";
import LoadingDiv from "@/app/components/LoadingDiv";
import {useState} from "react";
import Button from "@mui/material/Button";
import ErrorPage from "@/app/components/ErrorPage";

export default function TestPage() {
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)

    const screen = () => {
        if (error){return <ErrorPage />}
        if (loading){return <LoadingDiv />}
        return (<div id={"main-content"} style={{padding: "15% 1rem"}}><p>Correct Content!</p></div>)
    }

    return(<>
            <HomeBar />
            <div style={{
                display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", position: "absolute", top: "75px", width: "100%"
            }}>
            <p>Error takes priority over loading</p>
                <div className={"button-list row"}>
                    <Button onClick={() => {setError(!error)}}>Error: {error ? "True" : "False"}</Button>
                    <Button onClick={() => {setLoading(!loading)}}>Loading: {loading ? "True" : "False"}</Button>
                </div>
            </div>
            {screen()}
    </>
    )
}