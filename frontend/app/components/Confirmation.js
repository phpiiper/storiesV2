'use client'

import {useState} from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

export default function Confirmation({children, header="Confirmation", text, onConfirm=()=>{}}) {
    const [open, setOpen] = useState(false)
    const close = () => {setOpen(false)}

    return (<><div
        className={"confirm-container"}
        style={{display: open ? "flex" : "none"}}
        onClick={() => setOpen(false)}
    >
        <div className={"confirm-div"}>
            <div className={"confirm-text-div"}>
                <h2>{header}</h2>
                <p>{text}</p>
            </div>
            <div className={"confirm-button-div button-list row"}>
                <button className={"reject confirm-button"} onClick={close}><ClearIcon /> <span>Reject</span></button>
                <button className={"confirm confirm-button"} onClick={()=> {
                    onConfirm();
                    close();
                }}><CheckIcon /> <span>Confirm</span></button>
            </div>
        </div>
    </div>
        <div className={"confirm-button"} onClick={()=> {setOpen(true)}}>{children}</div>
    </>)
}