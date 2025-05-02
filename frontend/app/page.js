"use client";
import * as React from "react";
import { useState, useEffect  } from "react";
import Head from "next/head";
import HomeBar from "./components/HomeBar";
import Stories from "./components/Stories";
import {useSession} from "next-auth/react";
import axios from "axios";
import LoadingDiv from "@/app/components/LoadingDiv";
import ErrorPage from "@/app/components/ErrorPage";



export default function Home({}) {
  const { status, data: sessionData } = useSession();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  useEffect( () => {
    async function getStories() {
      let storyData = await axios.get(`/api/stories`)
      if (storyData.status === 200) {
        setStories(storyData.data)
        setIsLoading(false)
      } else {
        console.log(storyData.data.error)
        setIsError(true)
      }
    }
   getStories()
  },[])

  if (isError){
    return (<ErrorPage>
      <a href={"/"} >GO BACK</a>
    </ErrorPage>)
  }
  if (isLoading){
    return (<>
        <div id={"content"}>
          <HomeBar />
          <div id={"main-content"}>
            <LoadingDiv />
          </div>
        </div>
  </>)
  }


  return (
      <>
        <div id={"content"}>
          <HomeBar />
          <div id={"main-content"}>
            <Stories name={"All Stories"} stories={stories} status={{status, sessionData}} />
          </div>
        </div>
      </>
  );
}
