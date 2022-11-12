import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);
    const [strengthText, setStrengthText] = useState("");    

    function strengthDetect(password: string) {
        if (password.length < 1) return { score: 0, message: "" };

        const matches = {
            pos: {},
            neg: {},
        };

        const counts: {
            pos: { [key: string]: number };
            neg: { [key: string]: number };
        } = {
            pos: {},
            neg: {
                seqLetter: 0,
                seqNumber: 0,
                seqSymbol: 0,
            },
        };

        const tmp: any = {};
        let strength = 0;
        let letters = "abcdefghijklmnopqrstuvwxyz";
        let numbers = "01234567890";
        let symbols = ")!@#$%^&*()";
        let back: any;
        let forth: any;
        let i: any;

        letters = (password.match(/[a-z]/g) || []).join("");
        counts.pos.Lower = letters.length;
        counts.pos.Upper = (password.match(/[A-Z]/g) || []).join("").length;
        counts.pos.Numbers = (password.match(/\d/g) || []).join("").length;
        counts.pos.Symbols = (password.match(/[$-/:-?{-~!^_`\[\]]/g) || [])
            .join("")
            .length;
        counts.pos.MiddleNumber = (password.slice(1, -1).match(/\d/g) || [])
            .join("")
            .length;
        counts.pos.MiddleSymbol = (password.slice(1, -1).match(
            /[$-/:-?{-~!^_`\[\]]/g
        ) || []).join("").length;
        
        for (i = 0; i < letters.length; i++) {
            back = letters.substring(i, i + 1);
            forth = letters.substring(i + 2, i + 3);

            if (back && forth && back === forth) {
                counts.neg.seqLetter++;
            }
        }

        for (i = 0; i < numbers.length; i++) {
            back = numbers.substring(i, i + 1);
            forth = numbers.substring(i + 2, i + 3);

            if (back && forth && back === forth) {
                counts.neg.seqNumber++;
            }
        }

        for (i = 0; i < symbols.length; i++) {
            back = symbols.substring(i, i + 1);
            forth = symbols.substring(i + 2, i + 3);

            if (back && forth && back === forth) {
                counts.neg.seqSymbol++;
            }
        }

        counts.neg.Repeat = (password.match(/(.)\1/g) || []).length;
        counts.neg.ConsecLower = (password.match(/(?=([a-z]{2}))/g) || [])
            .length;
        counts.neg.ConsecUpper = (password.match(/(?=([A-Z]{2}))/g) || [])
            .length;
        counts.neg.ConsecNumber = (password.match(/(?=(\d{2}))/g) || []).length;
        counts.neg.ConsecSymbol = (password.match(/(?=([$-/:-?{-~!^_`\[\]]{2}))/g) || [])
            .length;
        counts.neg.Requirements = (password.length < 8 ? 1 : 0) + (counts.pos.Lower === 0 ? 1 : 0) + (counts.pos.Upper === 0 ? 1 : 0) + (counts.pos.Numbers === 0 ? 1 : 0) + (counts.pos.Symbols === 0 ? 1 : 0);

        tmp.Requirements = (counts.neg.Requirements * 2);
        tmp.Lower = (counts.pos.Lower * 2) - counts.neg.ConsecLower;
        tmp.Upper = (counts.pos.Upper * 2) - counts.neg.ConsecUpper;
        tmp.Numbers = (counts.pos.Numbers * 2) - counts.neg.ConsecNumber;
        tmp.Symbols = (counts.pos.Symbols * 2) - counts.neg.ConsecSymbol;
        tmp.MidChar = (counts.pos.MiddleSymbol + counts.pos.MiddleNumber) * 2;
        tmp.Other = tmp.Lower + tmp.Upper + tmp.Numbers + tmp.Symbols;
        tmp.Other = (tmp.Other * 2) + (counts.pos.Numbers + counts.pos.Symbols);
        tmp.Length = (password.length * 4) - counts.neg.seqNumber - counts.neg.seqSymbol - counts.neg.seqLetter;
        tmp.Length = tmp.Length + ((tmp.Length > 100) ? 3 : 0) + ((tmp.Length > 12) ? (tmp.Length - 12) : 0);
        tmp.Requirements = (tmp.Requirements < 0) ? 0 : tmp.Requirements;

        strength = tmp.Other + tmp.Length - tmp.Requirements + tmp.MidChar;

        strength = Math.min(Math.max(Math.round(strength), 0), 100);

        return {
            score: strength,
            message: strength < 20 ? "Very Weak" : strength < 40 ? "Weak" : strength < 60 ? "Good" : strength < 80 ? "Strong" : "Very Strong",
        };
    }

    useEffect(() => {
        const password = document.getElementById("password") as HTMLInputElement;

        password.addEventListener("keyup", function (event) {
            event.preventDefault();

            setPassword(password.value);

            if (password.value.length > 0) {
                const strengthD = strengthDetect(password.value);

                setStrength(strengthD.score);
                setStrengthText(strengthD.message);
            }
        });
    }, [password]);

    const register = async (event: any) => {
        event.preventDefault();

        const password = document.getElementById("password") as HTMLInputElement;
        const username = document.getElementById("username") as HTMLInputElement;
        const email = document.getElementById("email") as HTMLInputElement;

        if (password.value.length < 1) {
            return;
        }

        if (username.value.length < 1) {
            return;
        }

        if (email.value.length < 1) {
            return;
        }

        const data = {
            username: username.value,
            password: password.value,
            email: email.value,
        };

        console.log(data);

        await axios.post("/api/auth/register", data);
    }

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>

            <div className="login">
                <h1>Register</h1>

                <form onSubmit={register}>
                    <div className="form-group">
                        <div className="form-input">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" id="username" autoComplete="off" placeholder="John Doe" />
                        </div>

                        <div className="form-input">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" autoComplete="off" placeholder="john.doe@gmail.com" />
                        </div>

                        <div className="form-input">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" autoComplete="off" />
                            <span className={strength < 20 ? "weak" : strength < 40 ? "medium" : strength < 60 ? "good" : strength < 80 ? "strong" : "very-strong"}></span>
                            <p className="strengthText">{strengthText}</p>
                        </div>

                        <input type="submit" value="Register" />
                        <p>Already have an account? <Link href="/app/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </>
    )
}