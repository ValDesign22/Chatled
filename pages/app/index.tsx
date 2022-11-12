import { GetServerSideProps } from "next";
import Head from "next/head";
import { User } from "../../utils/interfaces";
import { parseUser } from "../../utils/parseUser";
import RoomsBar from "../../components/RoomsBar";
import ChatBox from "../../components/ChatBox";

export default function App(props: { user: User }) {
    return (
        <>
            <Head>
                <title>App</title>
            </Head>

            <RoomsBar user={props.user} />

            <ChatBox user={props.user} />
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (ctx) => {
    const user = parseUser(ctx);

    if (!user) return {
        redirect: {
            destination: "/app/login",
            permanent: false
        }
    }

    return { props: { user: user } };
}