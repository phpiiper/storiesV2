import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingDiv() {
    return (<div className={"loading-div"}>
        <h2>LOADING</h2>
        <CircularProgress />
    </div>)
}