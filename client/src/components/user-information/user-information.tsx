import { useEffect, useRef, useState } from "react";
import { User } from "../models";
import "./user-information.css"

export interface UserInfoProps {
    isMyProfile: boolean,
    usr: User,
}


export function UserInfo({ isMyProfile, usr }: UserInfoProps) {

    const [textOpen, setTextOpen] = useState<boolean>(false)
    const togglePostText = () => {
        setTextOpen(!textOpen)
    }

    const refText = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    useEffect(() => { textOpen ? setHeight(refText.current.scrollHeight) : setHeight(0) }, [textOpen]);

    const style = { maxHeight: `${height}px` }

    const newDate = new Date(usr.dateOfBirth);
    const day = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();


    return (
        <div className="test-container">
            <div className="information">
                <div className="horizontal-container">
                    <div className="short-info">
                        <div className="short-info__avatar" />
                        <div className="short-info__name">
                            {`${usr.firstName} ${usr.lastName}`}
                        </div>
                        <button
                            className="button"
                            onClick={() => { togglePostText() }}>
                            {textOpen ? "Less information ↑" : "More information ↓"}
                        </button>
                    </div>
                    {
                        isMyProfile ?
                            <button className="button">Create post</button> :
                            <button className="button">Follow</button>
                    }
                </div>
                <div style={style} className="contaner">
                    <div
                        ref={refText}
                        className="detailed-info">
                        <p className="detailed-info__section">{usr.email}</p>
                        <p className="detailed-info__section">{usr.login}</p>
                        <p className="detailed-info__section">{usr.aboutMe}</p>
                        <p className="detailed-info__section">{`${day}.${month}.${year}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}