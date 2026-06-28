import { useState, type SetStateAction } from "react";
import '../css/Login.css';
export function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [requestsent, setRequestSent] = useState(false);
    const [data, setData] = useState('');

    const getValue = (setter: React.Dispatch<SetStateAction<string>>) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(event.target.value);
        }
    }

    const Submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setRequestSent(true);
            const request = await fetch('http://localhost:3500/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName, password,
                }),
            });

            const response = await request.json();
            setData(response.message);
            setRequestSent(false);
        }
        catch (error) {
            setRequestSent(false);
            console.error(error);
            setData('Could not Submit request');
        }
    }
    return (
        <div id="parent">
            <div id="container">
                <div id="child">
                    <form onSubmit={Submit}>
                        <label>Enter Username</label><br />
                        <input type='text' onChange={getValue(setUserName)} required /><br />
                        <label>Enter Username</label><br />
                        <input type='password' onChange={getValue(setPassword)} required /><br />
                        <button>Sign Up {requestsent && <span id="spinner"></span>}</button>
                    </form>
                </div>
                {data && <p id="data">{data}</p>}
            </div>
        </div>
    )
}
export default Login