import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { useState } from "react";

export default function App(props: { userId: string }) {
    const [error, setError] = useState("");

    const confirm = async (event: any) => {
        event.preventDefault();
        const code = document.getElementById("code") as HTMLInputElement;

        const response = await axios.post(`/api/auth/confirm/${props.userId}`, {
            code: code.value
        });

        if (response.data.error) setError(response.data.error);
        else window.location.href = "/app/login";
    };
    return (
        <>
            <Head>
                <title>Confirm</title>
            </Head>

            <div className="confirm">
                <h1>Confirm Account</h1>
                <p>To confirm your email address, please use the code we sent you in the email.</p>
                <form onSubmit={confirm}>
                    <input type="text" name="code" placeholder="code" id="code" pattern="[0-9]{6}" required />
                    {error && <p className="error">{error}</p>}
                    <input type="submit" value="Confirm" />
                </form>
            </div>    
        </>
    )
}

export const getServerSideProps: GetServerSideProps<{ userId: string }> = async (ctx) => {
    const id = ctx.query.id as string;

    if (!id) return {
        redirect: {
            destination: "/app/login",
            permanent: false
        }
    }

    const { data } = await axios.get(`${process.env.APP_URL}/api/users/${id}`);

    if (!data) return {
        redirect: {
            destination: "/app/register",
            permanent: false
        }
    }

    if (data.confirmed === "Active") return {
        redirect: {
            destination: "/app/login",
            permanent: false
        }
    }

    return { props: { userId: id } };
}