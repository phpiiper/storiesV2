import Chip from '@mui/material/Chip';
import {Snackbar} from "@mui/material";

export default function SnackbarContainer({open, duration=6000, message="Message", handleClose }) {
    return (<Snackbar
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        message={message}
    />)
}