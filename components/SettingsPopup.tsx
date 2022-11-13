import { MouseEventHandler, useState } from "react";
import { User } from "../utils/interfaces";
import { BsFillPersonFill, BsHouseFill } from "react-icons/bs";

export default function SettingsPopup(props: { shown: boolean, showFunc: MouseEventHandler, user: User }) {
    const [activeNav, setActiveNav] = useState("general");

    return (
        <div className={`settingsPopup ${props.shown ? "shown" : ""}`}>
            <div className="popup">
                <div className="close" onClick={props.showFunc}>
                    <span></span>
                </div>
                <h1>Settings</h1>
                <div className="navSelect">
                    <div className="nav">
                        <div className={`item ${activeNav === "general" ? "active" : ""}`} onClick={() => setActiveNav("general")}>
                            <BsHouseFill />
                            <p>General</p>
                            <p className="tooltip">General Settings</p>
                        </div>
                        <div className={`item ${activeNav === "profile" ? "active" : ""}`} onClick={() => setActiveNav("profile")}>
                            <BsFillPersonFill />
                            <p>Account</p>
                            <p className="tooltip">Account Settings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}