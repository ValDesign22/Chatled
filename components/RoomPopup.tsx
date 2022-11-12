import {User} from "../utils/interfaces";
import { MouseEventHandler, useState } from "react";
import axios from "axios";

export default function RoomPopup(props: { showFunc: MouseEventHandler, user: User, shown: boolean }) {
    const [error, setError] = useState(false);

    const createRoom = async () => {
        const roomName = document.getElementById("name") as HTMLInputElement;

        const res = await axios.post(`/api/rooms`, {
            name: roomName.value,
            owner: props.user.id
        });

        if (res.status === 200 && !res.data.error) {
            setError(false);
            window.location.href = `/app/rooms/${res.data.id}`;
        }
        if (res.data.error) setError(true);
    }
    return (
        <div className={`roomPopup ${props.shown ? "shown" : ""}`}>
            <div className="popup">
                <div className="header">
                    <h1>Create Room</h1>
                    <div className="close" onClick={props.showFunc}>
                        <span></span>
                    </div>
                </div>
                <div className="body">
                    <div className="input">
                        {error ? <p className="errorText">No room name provided</p> : null}
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" autoComplete="off" {...(error ? {className: "error"} : {})} />
                    </div>

                    <button onClick={createRoom}>Create</button>
                </div>
            </div>
        </div>
    )
}