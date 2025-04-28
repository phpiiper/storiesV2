export default function ErrorPage({error="Error Status",msg="Error Message", children}) {
    return (<div className={"error-page"}>
        <h2>{error}</h2>
        <p>{msg}</p>
        {children}
    </div>)
}