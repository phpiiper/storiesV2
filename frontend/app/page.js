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
import dayjs from "dayjs";
import CheckIcon from "@mui/icons-material/Check";



export default function Home({}) {
  const { status, data: sessionData } = useSession();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [filters, setFilters] = useState({
    title: "", genre: "", author: "", tags: []
  })
  const changeFilter = (key, value) => {
    setFilters({...filters, [key]: value})
  }

  useEffect( () => {
    async function getStories() {
      let storyData = await axios.get(`/api/stories`, {
      params: {
        title: filters.title,
        genre: filters.genre,
        user: filters.author,
        tags: filters.tags
      }
      })
      if (storyData.status === 200) {
        setStories(storyData.data); setIsLoading(false)
      } else {
        console.log(storyData.data.error); setIsError(true)
      }
    }
   getStories()
  },[filters])

  if (isError){
    return (<ErrorPage>
      <a href={"/"} >GO BACK</a>
    </ErrorPage>)
  }
  if (isLoading){
    return (<LoadingDiv />)
  }

  return (<>
    <div className={"page home-page"}>
      <h1 style={{fontSize: "1rem"}}>READCEIPT</h1>
      <h2 style={{fontSize: "2rem", fontWeight: 300}}>STORIES</h2>
      <div className={"container row"}>
        <div className={"container-div left"}>
          Site Creator
        </div>
        <div className={"container-div rightAlign"}>
          Piper P.
        </div>
      </div>
      <div className={"container row"}>
        <div className={"container-div left"}>
          {dayjs(new Date).format("MMMM D, YYYY")}
        </div>
        <div className={"container-div rightAlign"}>
          {dayjs(new Date).format("h:mm A")}
        </div>
      </div>
      <hr style={{width: "100%", margin: "1rem 0"}}/>

      <div className={"story-list"}>
        <div className={"story-list-item header"}>
          <div className={"id"}>#</div>
          <div className={"title"}>Story Name</div>
          <div className={"author"}>Author</div>
          <div className={"genre"}>Genre</div>
          <div className={"options"}>
            <span>Read</span>
            <span>Info</span>
          </div>
        </div>
        {stories.map((value, index) => (<div className={"story-list-item item"} key={"st-"+value.id}>
          <div className={"id"}>{index+1}</div>
          <div className={"title"}>{value.title}</div>
          <div className={"author"}>{value.username}</div>
          <div className={"genre"}>{value.genre}</div>
          <div className={"options"}>
            <div className={"read"}><a
                href={`/story/${value.id}/1`}
                  className={"hover-reveal box-icon-button"}
                  ><button><CheckIcon /></button></a></div>
                  <div className={"info"}><a
                href={`/story/${value.id}`}
                className={"hover-reveal box-icon-button"}
            ><button><CheckIcon /></button></a></div>
          </div>
        </div>))}
      </div>

      <hr style={{width: "100%", margin: "1rem 0"}}/>
      <div className={"story-page-filter-list"}>
        <div className={"container row"} style={{fontWeight: 500}}>
          <div className={"container-div left"}>
            FILTERS
          </div>
          <div className={"container-div rightAlign"}>
            ({stories.length}) Stories
          </div>
        </div>
        <div className={"container row"}>
          <div className={"container-div left"}>
            Title
          </div>
          <div className={"container-div rightAlign"}>
            <input
              type={"text"}
              id={"title"}
              value={filters.title}
              onChange={(event)=>{changeFilter("title",event.target.value)}}
            />
          </div>
        </div>
        <div className={"container row"}>
          <div className={"container-div left"}>
            Genre
          </div>
          <div className={"container-div rightAlign"}>
            <input
                type={"text"}
                id={"genre"}
                value={filters.genre}
                onChange={(event)=>{changeFilter("genre",event.target.value)}}
            />
          </div>
        </div>
        <div className={"container row"}>
          <div className={"container-div left"}>
            Author
          </div>
          <div className={"container-div rightAlign"}>
            <input
                type={"text"}
                id={"author"}
                value={filters.author}
                onChange={(event)=>{changeFilter("author",event.target.value)}}
            />
          </div>
        </div>
      </div>
      <hr style={{width: "100%", margin: "1rem 0"}}/>
      <div className={"footer-div"}>
        <p style={{textAlign: "center", fontSize: "0.8rem"}}>Made with NextJS/React (Vercel) + NodeJS (Render) + PostgreSQL (Supabase)</p>
        <a style={{textAlign: "center", fontSize: "0.75rem", width: "fit-content"}} href={"https://github.com/phpiiper/storiesV2"} target={"_blank"}>View Github</a>
      </div>
    </div>
  </>)

}
