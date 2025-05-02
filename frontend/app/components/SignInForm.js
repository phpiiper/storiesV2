'use client'
import { signIn, useSession } from "next-auth/react";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import axios from "axios";
import { useState, } from "react";

export default function SignInForm({open=false}) {
    const { status, data: sessionData, update } = useSession();
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");

    async function signUpFunction() {
        let user = document.getElementById("sign-in-username").value;
        let pw = document.getElementById("sign-in-password").value;
        try {
            const res = await axios.post("/api/user", {
                username: user,
                password: pw
            });
            console.log("Success:", res.data);
            setIsError(false)
            setError("")
            await signInFunction()
        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            console.log(err.response.data)
            setIsError(true)
            setError(err.response.data.message)
        }

    }

    async function signInFunction() {
        console.log("click",status)

        let user = document.getElementById("sign-in-username").value;
        let pw = document.getElementById("sign-in-password").value;
        let res = await signIn("credentials", {
            user: user, password: pw, redirect: false
        })
        if (res.error){
            const message = res.error;
            console.log(`error: ${message}`)
            setIsError(true)
            setError(message)
            return
        }
        else {
            setIsError(false)
        }
        await update()
        console.log("after",status,res)
    }
    if (!open) {
        return null
    }
    return (
        <div className={"sign-in-form"}>
            <h1>Sign In</h1>
            <div className={"sign-in-form-fields"}>
            <TextField
                variant="filled"
                id="sign-in-username"
                type={"text"}
                placeholder={"Username"}
            />
            <TextField
                variant="filled"
                id="sign-in-password"
                type={"password"}
                placeholder={"Password"}
            />
            </div>
            <div className={"button-row"}>
                <Button onClick={signUpFunction}>Sign Up</Button>
                <Button onClick={signInFunction}>Sign In</Button>
                <span className={"error-message"}>{isError ? error : ""}</span>
            </div>
        </div>
    )
}