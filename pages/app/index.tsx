import { GetServerSideProps } from "next";
import Head from "next/head";
import { Room, User } from "../../utils/interfaces";
import { parseUser } from "../../utils/parseUser";
import RoomsBar from "../../components/RoomsBar";
import axios from "axios";
export default function App(props: { user: User, rooms: Room[] }) {
    return (
        <>
            <Head>
                <title>App</title>
            </Head>

            <RoomsBar user={props.user} rooms={props.rooms} />
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

    return { props: { user, rooms: data } };
}