import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { User } from "../../utils/interfaces";
import { parseUser } from "../../utils/parseUser";

export default function Login(props: { user: User }) {
    const login = async (event: any) => {
        event.preventDefault();
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        const res = await axios.post("/api/auth/login", {
            email: email.value,
            password: password.value,
        });

        if (res.status === 200) window.location.href = "/app";
        else alert(res.data.message);
    }
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <div className="login">
                <h1>Login</h1>

                <form onSubmit={login}>
                    <div className="form-group">
                        <div className="form-input">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" autoComplete="off" placeholder="john.doe@gmail.com" />
                        </div>

                        <div className="form-input">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" autoComplete="off" />
                        </div>

                        <input type="submit" value="Login" />
                        <p>Dont have an account? <Link href="/app/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps<{ user: User }> = async (ctx) => {
    const user = parseUser(ctx);

    if (user) return {
        redirect: {
            destination: "/app",
            permanent: false
        }
    }

    return { props: { user } };
}