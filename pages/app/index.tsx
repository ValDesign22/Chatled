import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { User } from "../../utils/interfaces";
import { parseUser } from "../../utils/parseUser";

export default function App(props: { user: User }) {
    return (
        <>
            <Head>
                <title>App</title>
            </Head>
            <h1>App</h1>

            <p>
                <Link href="/">Home</Link>
            </p>
            
            <p>
                <Link href="/app">App</Link>
            </p>
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