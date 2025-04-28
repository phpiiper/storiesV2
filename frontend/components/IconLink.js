export default function IconLink({href, onClick=()=>{}, text="Button", children}) {
    return (
        <a href={href} onClick={onClick}>
            <div className={"drawer-item"}>
                <div className={"drawer-icon"}> {children} </div>
                <span>{text}</span>
            </div>
        </a>
    )
}