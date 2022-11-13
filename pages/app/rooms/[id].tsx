import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Room, User } from "../../../utils/interfaces";
import RoomsBar from "../../../components/RoomsBar";
import ChatBox from "../../../components/ChatBox";
import { parseUser } from "../../../utils/parseUser";

export default function App(props: { user: User, rooms: Room[] }) {
    const router = useRouter();
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => setInRoom(router.pathname.includes("/app/rooms/")), [router.pathname]);
    
    return (
        <>
            <Head>
                <title>App</title>
            </Head>

            <RoomsBar user={props.user} rooms={props.rooms} />

            {inRoom && <ChatBox user={props.user} />}
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ user: User, rooms: Room[] }> = async (ctx) => {
    const user = parseUser(ctx);

    if (!user) return {
        redirect: {
            destination: "/app/login",
            permanent: false
        }
    }

    const { data } = await axios.get(`${process.env.APP_URL}/api/rooms`);

    const getRoom = async () => {
        const { data } = await axios.get(`${process.env.APP_URL}/api/rooms/${ctx.query.id}`);
        return data;
    }

    const room = await getRoom();

    if (room.error) return {
        redirect: {
            destination: "/app/rooms",
            permanent: false
        }
    }

    if (!room.users.includes(user.id) && room.owner !== user.id) {
        return {
            redirect: {
                destination: "/app",
                permanent: false
            }
        }
    }

    return { props: { user, rooms: data } };
}