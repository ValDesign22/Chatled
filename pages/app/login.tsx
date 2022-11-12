import axios from "axios";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
    const login = async () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        const res = await axios.post("/api/auth/login", {
            email: email.value,
            password: password.value,
        });

        if (res.data.success) window.location.href = "/app";
        else alert(res.data.message);
    }
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <div className="login">
                <h1>Login</h1>

                <form>
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