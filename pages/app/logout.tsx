import { GetServerSideProps } from "next";
import Head from "next/head";
import { User } from "../../utils/interfaces";
import { parseUser } from "../../utils/parseUser";

export default function Login(props: { user: User }) {
    return (
        <>
            <Head>
                <title>Logout</title>
            </Head>
        </>
    )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: User }> = async (ctx) => {
    const user = parseUser(ctx);

    if (!user) return {
        redirect: {
            destination: "/app",
            permanent: false
        }
    }

    if (user) return {
        redirect: {
            destination: "/api/auth/logout",
            permanent: false
        }
    }

    return { props: { user } };
}