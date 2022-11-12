import {Room, User} from "../utils/interfaces";
import Link from "next/link";
import RoomPopup from "./RoomPopup";
import { useState } from "react";

export default function RoomsBar(props: { user: User, rooms: Room[] }) {
    const [showPopup, setShowPopup] = useState(false);

    const toggle = () => setShowPopup(!showPopup);
    return (
        <>
            <RoomPopup user={props.user} shown={showPopup} showFunc={toggle} />
            <div className="rooms">
                <div className="header">
                    {props.rooms.map((room, index) => (
                        (room.owner === props.user.id || room.users.includes(props.user.id)) && (
                        <div className="room" key={index}>
                            <Link href={`/app/rooms/${room.id}`}>
                                {/* name acronym of room name */}
                                <span>{room.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>
                            </Link>
                            <p className="tooltip">{room.name}</p>
                        </div>)
                    ))}
                    <div className="room" onClick={toggle}>
                        <button>
                            <span>+</span>
                        </button>
                        <p className="tooltip">Create Room</p>
                    </div>
                </div>
            </div>
        </>
    )
}