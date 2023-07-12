import altAvatar from "../../assets/default-avatar.png"
import { useState } from "react";
import { User } from "../models";

type UserListProps = {
	userList: User[],
}

export function UserList({ userList }: UserListProps) {
	return (
		<>
			{userList.map(user => {
				return (
					<li className="user-list__item">
						<Avatar src={user.avatar} alt="avatar" />
					</li>
				)
			}
			)}
		</>
	)
}

type AvatarProps = {
	src: Blob,
	alt: string,
	width?: number,
	height?: number,
}

const Avatar = ({ src, alt, width, height }: AvatarProps) => {
	return (
		<div>
			{src ? <img src={URL.createObjectURL(src)} alt={alt} /> : <img src={altAvatar} alt="default avatar" />}
		</div>
	)
}