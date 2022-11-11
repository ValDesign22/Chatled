import Head from "next/head";
import Link from "next/link";

export default function Login() {
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

                        <button type="submit">Login</button>
                        <p>Dont have an account? <Link href="/app/register">Register</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}