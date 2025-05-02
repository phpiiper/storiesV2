import Button from "@mui/material/Button";

export default function ErrorPage({error="Error Status",msg="Error Message", href="/", hrefText="Home", children}) {
    return (<div className={"error-page"}>
        <h2>{error}</h2>
        <p>{msg}</p>
        {href && <Button href={href}>Return {hrefText}</Button>}
        {children}
    </div>)
}