import { MouseEventHandler, useEffect, useState } from "react";
import { User } from "../utils/interfaces";
import { BsFillPersonFill, BsHouseFill } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { ImFilePicture } from "react-icons/im";
import Image from "next/image";
import axios from "axios";

export default function SettingsPopup(props: { shown: boolean, showFunc: MouseEventHandler, user: User }) {
    const [activeNav, setActiveNav] = useState("general");
    const [user, setUser] = useState(props.user);

    const imgurID = "498b7c959601a9d";

    const updateProfilePicture = async (e: any) => {
        e.preventDefault();
        
        const response = await axios.post(`/api/upload?user=${user.id}`);

        console.log(response);

        setUser(response.data.user);

        return alert("This feature is not yet implemented.");

        if (e.target.files.length === 0) return;

        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        const res = await axios.post(`https://api.imgur.com/3/image`, formData, {
            headers: {
                Authorization: `Client-ID ${imgurID}`,
                Accept: "application/json"
            }
        });

        const data = res.data;

        console.log(data);
    }

    return (
        <div className={`settingsPopup ${props.shown ? "shown" : ""}`}>
            <div className="popup">
                <div className="close" onClick={props.showFunc}>
                    <span></span>
                </div>
                <div className="navSelect">
                    <div className="nav">
                        <div className={`item ${activeNav === "general" ? "active" : ""}`} onClick={() => setActiveNav("general")}>
                            <BsHouseFill />
                            <p>General</p>
                        </div>
                        <div className={`item ${activeNav === "profile" ? "active" : ""}`} onClick={() => setActiveNav("profile")}>
                            <BsFillPersonFill />
                            <p>Account</p>
                        </div>
                    </div>
                </div>
                <div className="content">
                    {activeNav === "general" ? (
                        <div className="general">
                            <div className="item">
                                <p>Dark Mode</p>
                                <div className="switch">
                                    <input type="checkbox" id="darkMode" />
                                    <label htmlFor="darkMode"></label>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="profile">
                            <div className="item">
                                <p>Avatar</p>
                                <div className="avatar">
                                    <Image src={props.user.avatar ?? `https://ik.imagekit.io/${"adni8omxg"}/default-avatar`} alt="Avatar" width={100} height={100} id="avatarPreview" />
                                    
                                    <div className="change">
                                        <input type="file" id="avatar" accept="image/*" onChange={updateProfilePicture} />
                                        <label htmlFor="avatar" id="avatar"><ImFilePicture />Upload</label>
                                    </div>
                                </div>

                                <div className="avatarLimitations">
                                    <p>Max. 50MB</p>
                                    <p>Supported: .jpg, .png</p>
                                    <p>Recommended: 500x500</p>
                                </div>
                            </div>

                            <div className="item">
                                <p>Username</p>
                                <input type="text" value={props.user.username} />
                                <button>Change</button>
                            </div>
                            <div className="item">
                                <p>Email</p>
                                <input type="text" value={
                                    props.user.email
                                        .split("@")
                                        .map((e, i) => i === 0 ? e[0] + "*".repeat(e.length - 1) : e)
                                        .join("@")
                                } />
                                <button>Change</button>
                            </div>
                            <div className="item">
                                <p>Password</p>
                                <input type="password" value="********" />
                                <button>Change</button>
                            </div>

                            <button className="logout" onClick={() => {
                                window.location.href = "/app/logout";
                            }}>
                                <RiLogoutCircleRLine />
                                <p>Logout</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}