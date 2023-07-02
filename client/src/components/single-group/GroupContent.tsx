import "./group-content.css"
import { useEffect, useState } from "react"
import fetchHandler from "../../additional-functions/fetchHandler"
import toggleHook from "../../hooks/useToggle"
import UserPost from "../user-post/UserPost"
import { fetchErrorChecker } from "../../additional-functions/fetchErr"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { GroupFetchedEvent, GroupFetchedPost } from "../models"
import { GroupEvent } from "./GroupEvent"
import { CreateGroupContent } from "../create-group-content/CreateGroupContent"

interface GroupContentProp {
    groupId: number
}

export function GroupContent({ groupId }: GroupContentProp) {
    const { toggle: isPosts, toggleChange: switchPosts } = toggleHook(true)
    const [fetchedPosts, setFetchedPosts] = useState<GroupFetchedPost[]>([])
    const [fetchedEvents, setFetchedEvents] = useState<GroupFetchedEvent[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        fetchHandler(`http://localhost:8080/group/${groupId}/feed`, "GET")
            .then((r) => r.json())
            .then((r) => {
                if (r.errors) throw r.errors
                setFetchedPosts(r.data.posts)
                setFetchedEvents(r.data.events)
            })
            .catch((err) => {
                fetchErrorChecker(err, navigate)
            })
    }, [groupId])

    return (
        <div className="group-content">
            <div className="group-content__buttons-wrapper">
                <div className="group-content__buttons">
                    <CreateGroupContent {...{ isPosts, groupId }} />
                    <button className="button group__button" type="button" onClick={switchPosts}>
                        Go to {isPosts ? "events" : "posts"}
                    </button>
                </div>
            </div>
            {isPosts ? GroupPosts(fetchedPosts) : GroupEvents(fetchedEvents, navigate)}
        </div>
    )
}

function GroupPosts(posts: GroupFetchedPost[]) {
    return (
        <div className="group-content__posts">
            {posts.length > 0 ? (
                posts.map((post, i) => (
                    <UserPost {...{ postId: post.id, background: "post_darker-gray" }} key={i} />
                ))
            ) : (
                <div className="group-content__no-data-template">No posts, yet</div>
            )}
        </div>
    )
}

function GroupEvents(groupEvents: GroupFetchedEvent[], navigate: NavigateFunction) {
    return (
        <div className="group-content__events">
            {groupEvents.length > 0 ? (
                groupEvents.map((groupEvent, i) => (
                    <GroupEvent {...{ groupEvent, navigate }} key={i} />
                ))
            ) : (
                <div className="group-content__no-data-template">No events, yet</div>
            )}
        </div>
    )
}
