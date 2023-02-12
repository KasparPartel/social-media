import { useEffect, useRef, useState } from "react";
import "./user-information.css"

export interface UserInfoProps {
    isMyProfile: boolean
}

export function UserInfo({ isMyProfile }: UserInfoProps) {

    const [textOpen, setTextOpen] = useState<boolean>(false)
    const togglePostText = () => {
        setTextOpen(!textOpen)
    }

    const refText = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>(0);
    useEffect(() => { textOpen ? setHeight(refText.current.scrollHeight) : setHeight(0) }, [textOpen]);

    const style = { maxHeight: `${height}px` }

    return (
        <div className="test-container">
            <div className="information">
                <div className="horizontal-container">
                    <div className="short-info">
                        <div className="short-info__avatar" />
                        <div className="short-info__name">
                            Name Lastname
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
                        <p className="detailed-info__section">profile@email.name</p>
                        <p className="detailed-info__section">profile_login</p>
                        <p className="detailed-info__section">On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</p>
                        <p className="detailed-info__section">xx.xx.xxx</p>
                    </div>
                </div>
            </div>
        </div>
    )
}