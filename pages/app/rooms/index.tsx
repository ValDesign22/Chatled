import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import RoomsBar from "../../../components/RoomsBar";
import { Room, User } from "../../../utils/interfaces";
import { parseUser } from "../../../utils/parseUser";

export default function Rooms(props: { user: User, rooms: Room[] }) {
    return (
        <>
            <Head>
                <title>Rooms</title>
            </Head>

            <RoomsBar user={props.user} rooms={props.rooms} />
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