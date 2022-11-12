import {User} from "../utils/interfaces";
import Link from "next/link";

export default function RoomsBar(props: { user: User }) {
    return (
        <div className="rooms">
            <div className="header">
                <div className="room">
                    <Link href="/app/rooms/1">
                        <span>R1</span>
                    </Link>
                    <p className="tooltip">Room 1</p>
                </div>
            </div>
        </div>
    )
}