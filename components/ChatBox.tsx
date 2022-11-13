import {User} from "../utils/interfaces";
import io, {Socket} from "socket.io-client";
import axios from "axios";
import {useEffect, useState} from "react";

let socket: Socket;

export default function ChatBox(props: { user: User }) {
    const [typing, setTyping] = useState(false);
    const [userTyping, setUserTyping] = useState("");

    useEffect(() => socketInitializer(), [userTyping]);

    function socketInitializer() {
        axios.get("/api/socket").then(res => {
            socket = io();

            socket.on('connect', () => {
                socket.emit('join', res.data);
            });

            socket.on("typing", (data: { user: User }) => {
                // if (props.user.id === data.user.id) return;

                setTyping(true);
                setUserTyping(data.user.username);
            });

            socket.on("stopTyping", (data: { user: User }) => {
                // if (props.user.id === data.user.id) return;

                setTyping(false);
                setUserTyping("");
            });
        });
    }

    function handleTyping(event: any) {
        event.preventDefault();

        if (event.target.value.length !== 0) socket.emit("typing", {user: props.user});
        else socket.emit("stopTyping", {user: props.user});
    }

    return (
        <div className="chatbox">
            <div className="main">
            </div>
            <div className="bottom">
                <input type="text" placeholder="Type a message..." onKeyUp={handleTyping} />
                <button>Send</button>
            </div>
        </div>
    )
}