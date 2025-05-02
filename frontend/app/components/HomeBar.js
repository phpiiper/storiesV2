'use client'
// MUI
import TextField from '@mui/material/TextField';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer'
import {useState} from "react";
// COMPONENTS
import SignInForm from "./SignInForm";
import IconLink from "./IconLink";

import { signOut, useSession } from "next-auth/react";
import {useRouter} from "next/navigation";



export default function HomeBar() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const { status, data: sessionData } = useSession();
    const router = useRouter();
    return (
        <div className={"home-bar"}>
            <a href={"/"}><h2 className={"home-site-name"}>Readceipt</h2></a>
            <div className={"home-search-bar search-bar"}>
                <TextField
                    id={"home-search-input"}
                    label={"Search"}
                    onKeyDown={(e) => {
                        if (e.key === "Enter"){
                            router.push(`/search?title=${e.target.value}`)
                        }
                    }}
                />
            </div>
            <button className={"home-drawer-button"} onClick={() => setOpenDrawer(true)}>
                <MenuIcon />
            </button>
            <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                anchor={"top"}
                className={"home-drawer"}
            >
                <div className={"drawer-content"}>
                    <div className={"drawer-header"}>
                        <h1>READCEIPT</h1>
                        <button className={"home-drawer-button"} onClick={() => setOpenDrawer(false)}>
                            <CloseIcon />
                        </button>
                    </div>
                    <div className={"drawer-items-div"}>
                        {
                            status === "unauthenticated" && (
                            <>
                            <IconLink
                                onClick={() => {setOpenLogin(!openLogin)}}
                                text={"Sign In"}
                            >
                                <LoginIcon/>
                            </IconLink>

                            <SignInForm open={openLogin} />
                            </>
                            )
                        }
                        {
                            status === "authenticated" && (
                                <>
                                <IconLink
                                onClick={() => {
                                    console.log("Signout")
                                    signOut()
                                }}
                                text={"Sign Out"}
                                > <LogoutIcon/> </IconLink>
                                <IconLink
                                href={"/profile"}
                                text={"Profile"}
                                > <PersonIcon/> </IconLink>
                                <IconLink
                                href={"/library"}
                                text={"Library"}
                                > <TurnedInIcon/> </IconLink>
                                <IconLink
                                href={"/create"}
                                text={"Create"}
                                > <CreateIcon/> </IconLink>
                                </>
                            )
                        }
                    </div>
                </div>
            </Drawer>

        </div>
    )
}