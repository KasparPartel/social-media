import "./followers-following.css"

interface User {
    firstName: string
    lastName: string
}

const userList: User[] = [
    {
        firstName: "Waldo",
        lastName: "West",
    },
    {
        firstName: "Olympia",
        lastName: "MacDuff",
    },
    {
        firstName: "Simin",
        lastName: "Fishman",
    },
    {
        firstName: "Zelig",
        lastName: "Apostolov",
    },
    {
        firstName: "Kathlyn",
        lastName: "Pontecorvo",
    },
    {
        firstName: "Kathlyn",
        lastName: "Pontecorvo",
    },
    {
        firstName: "Kathlyn",
        lastName: "Pontecorvo",
    },
    {
        firstName: "Kathlyn",
        lastName: "Pontecorvo",
    },
]

export default function FollowingFollowers() {
    return (
        <div className="test-container">
            <FollowingFollowersContainer header="Following" userList={userList} />
            <FollowingFollowersContainer header="Followers" userList={userList} />
        </div>
    )
}

interface FollowingFollowersContainerProps {
    header: string
    userList: User[]
}

function FollowingFollowersContainer({ header, userList }: FollowingFollowersContainerProps) {
    const generateColor = () => {
        const randNum = Math.floor(Math.random() * 3)
        const colors = ["5CDC97", "65C8FF", "9673ff"]

        return colors[randNum]
    }

    return (
        <div className="following-followers">
            <div className="following-followers__header">{header}</div>
            <div className="list">
                {userList.map((user, i) => (
                    <div className="user-card" key={i}>
                        <div
                            className="user-card__avatar"
                            style={{ backgroundColor: `#${generateColor()}` }}
                        ></div>
                        {`${user.firstName} ${user.lastName}`}
                    </div>
                ))}
            </div>
        </div>
    )
}
