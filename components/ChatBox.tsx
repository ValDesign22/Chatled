import {Message, Room, User} from "../utils/interfaces";
import io, {Socket} from "socket.io-client";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {MdSend} from "react-icons/md";
import MessageBlock from "./Message";

let socket: Socket;

export default function ChatBox(props: { user: User, room: Room }) {
    const [typing, setTyping] = useState(false);
    const [userTyping, setUserTyping] = useState("");
    const [msgs, setMsgs] = useState<Message[]>(props.room.messages);

    useEffect(() => socketInitializer(), [userTyping]);

    function socketInitializer() {
        setMsgs(props.room.messages);
        scrollToBottom();

        document.addEventListener("keydown", (e) => {
            const msgInput = document.getElementById("msgInput") as HTMLInputElement;

            if (e.key === "Enter") {
                if (msgInput.value.length === 0) return;
                if (msgInput.value.trim().length === 0) return;

                socket.emit("messageSent", {user: props.user, message: msgInput.value, room: props.room});

                msgInput.value = "";

                socket.emit("stopTyping", {user: props.user});

                scrollToBottom();
            }
        });

        axios.get("/api/socket").then(res => {
            socket = io();

            socket.on('connect', () => {
                socket.emit('join', res.data);
            });

            socket.on("typing", (data: { user: User }) => {
                if (props.user.id === data.user.id) return;

                setTyping(true);
                setUserTyping(data.user.username);
                setMsgs(msgs);
            });

            socket.on("stopTyping", (data: { user: User }) => {
                if (props.user.id === data.user.id) return;

                setTyping(false);
                setUserTyping("");
                setMsgs(props.room.messages);
            });

            socket.on("messageReceived", (data: { messages: Message[] }) => {
                setMsgs(data.messages);

                scrollToBottom();
            });
        });
    }

    function handleTyping(event: any) {
        event.preventDefault();

        if (event.target.value.length !== 0) socket.emit("typing", {user: props.user});
        else socket.emit("stopTyping", {user: props.user});
    }

    function sendMessage(event: any) {
        event.preventDefault();

        const msgInput = document.getElementById("msgInput") as HTMLInputElement;

        if (msgInput.value.length === 0) return;
        if (msgInput.value.trim().length === 0) return;

        socket.emit("messageSent", {user: props.user, message: msgInput.value, room: props.room});

        msgInput.value = "";

        socket.emit("stopTyping", {user: props.user});

        scrollToBottom();
    }

    function scrollToBottom() {
        const messagesEnd = document.getElementById("messagesEnd") as HTMLDivElement;

        messagesEnd.scrollIntoView({behavior: "auto"});
    }

    return (
        <div className="chatbox">
            <div className="messages" id="chatBox">
                {msgs.map((message, index) => (
                    <MessageBlock message={message} user={props.user} key={index}/>
                ))}
                <div id="messagesEnd" />
            </div>
            <div className="bottom">
                {typing && <div className="typing">
                    <p>{userTyping} is typing...</p>
                </div>}
                <div className="sender">
                    <input type="text" placeholder="Type a message..." onKeyUp={handleTyping} id="msgInput" autoComplete="off"/>
                    <button onClick={sendMessage}><MdSend /></button>
                </div>
            </div>
        </div>
    )
}