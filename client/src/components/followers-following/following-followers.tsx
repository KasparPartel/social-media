import "./followers-following.css"

interface User {
    firstName: string
    lastName: string
}

const userList: User[] = [
    {
        firstName: "Waldo",
        lastName: "West"
    }, {
        firstName: "Olympia",
        lastName: "MacDuff"
    }, {
        firstName: "Simin",
        lastName: "Fishman"
    }, {
        firstName: "Zelig",
        lastName: "Apostolov"
    }, {
        firstName: "Kathlyn",
        lastName: "Pontecorvo"
    }, {
        firstName: "Kathlyn",
        lastName: "Pontecorvo"
    }, {
        firstName: "Kathlyn",
        lastName: "Pontecorvo"
    }, {
        firstName: "Kathlyn",
        lastName: "Pontecorvo"
    }
];

export default function FollowingFollowers() {
    return (
        <section className="following-followers flex-column">
            <FollowingFollowersContainer header="Following"
                                         userList={userList}/>
            <hr className="container-separator"/>
            <FollowingFollowersContainer header="Followers"
                                         userList={userList}/>
        </section>
    )
}

interface FollowingFollowersContainerProps {
    header: string;
    userList: User[];
}

function FollowingFollowersContainer({header, userList}: FollowingFollowersContainerProps) {
    const generateColor = () => {
        const randNum = Math.floor(Math.random() * 3);
        const colors = ["5CDC97", "65C8FF", "9673ff"];

        return colors[randNum]
    }

    return (
        <div className="following-followers__container flex-column">
            <h3>{header}</h3>
            <ul className="flex-column">
                {userList.map((user, i) => (
                    <li key={i}
                        className="flex">
                        <div className="avatar-img"
                             style={{backgroundColor: `#${generateColor()}`}}></div>
                        {user.firstName} {user.lastName}</li>
                ))}
            </ul>
        </div>
    )
}