import {Room, User} from "../utils/interfaces";
import Link from "next/link";
import RoomPopup from "./RoomPopup";
import { useState } from "react";
import { useRouter } from "next/router";
import { BsGearFill, BsHouseFill, BsPlusLg } from "react-icons/bs";
import SettingsPopup from "./SettingsPopup";

export default function RoomsBar(props: { user: User, rooms: Room[] }) {
    const [showPopup, setShowPopup] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    
    const router = useRouter();

    const toggle = () => setShowPopup(!showPopup);
    const toggleSettings = () => setShowSettings(!showSettings);
    return (
        <>
            <RoomPopup user={props.user} shown={showPopup} showFunc={toggle} />
            <SettingsPopup user={props.user} shown={showSettings} showFunc={toggleSettings} />
            <div className="rooms">
                <div className="header">
                    {props.rooms.map((room, index) => (
                        (room.owner === props.user.id || room.users.includes(props.user.id)) && 
                        (<div className={`room ${(room.id.toString() === router.query.id) ? "active" : ""}`} key={index}>
                            <Link href={`/app/rooms/${room.id}`}>
                                <span>{room.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>
                            </Link>
                            <p className="tooltip">{room.name}</p>
                        </div>)
                    ))}
                    <div className="room" onClick={toggle}>
                        <BsPlusLg />
                        <p className="tooltip">Create Room</p>
                    </div>
                </div>
                <div className="bottom">
                    <div className={`settings ${(router.pathname.endsWith("/app")) ? "active" : ""}`}>
                        <Link href="/app">
                            <BsHouseFill />
                            <p className="tooltip">Home</p>
                        </Link>
                    </div>
                    <div className="settings" onClick={toggleSettings}>
                        <BsGearFill />
                        <p className="tooltip">Settings</p>
                    </div>
                </div>
            </div>
        </>
    )
}