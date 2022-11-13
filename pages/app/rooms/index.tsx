import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ChatBox from "../../../components/ChatBox";
import RoomsBar from "../../../components/RoomsBar";
import { Room, User } from "../../../utils/interfaces";
import { parseUser } from "../../../utils/parseUser";

export default function Rooms(props: { user: User, rooms: Room[] }) {
    const router = useRouter();
    const [inRoom, setInRoom] = useState(false);

    useEffect(() => setInRoom(router.pathname.includes("/app/rooms/")), [router.pathname]);
    return (
        <>
            <Head>
                <title>Rooms</title>
            </Head>

            <RoomsBar user={props.user} rooms={props.rooms} />

            {inRoom && <ChatBox user={props.user} />}
        </>
    );
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

    return { props: { user, rooms: data } };
}