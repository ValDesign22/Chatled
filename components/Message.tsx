import {Message, User} from "../utils/interfaces";

export default function MessageBlock(props: { message: Message, user: User }) {
    return (
        <div className={`message ${props.message.user.id === props.user.id ? "me" : ""}`}>
            <div className="username">{props.message.user.username}</div>
            <div className="messageText">{props.message.text}</div>
        </div>
    );
}