import Link from 'next/link'
import ErrorPage from "./components/ErrorPage";

export default function NotFound() {
    return (
        <ErrorPage
            error={"404"}
            msg={"Not Found"}
        >
            <Link href="/">Return Home</Link>
        </ErrorPage>
    )
}