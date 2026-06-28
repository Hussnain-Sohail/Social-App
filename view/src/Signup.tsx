import { useState, type SetStateAction } from "react";
import '../css/Signup.css'
export function Signup() {
    const [userName, setUserName] = useState('');
    const [age, setAge] = useState(18);
    const [password, setPassword] = useState('');
    const [data, setData] = useState('');
    const [requestsent, setRequestsent] = useState(false);

    const getValue = (setter: React.Dispatch<SetStateAction<string>>) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(event.target.value);
        }
    }

    const getIntegerValue = (setter: React.Dispatch<SetStateAction<number>>) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(Number(event.target.value));
        }
    }

    const Submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setRequestsent(true);
            const request = await fetch('http://localhost:3500/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName, age, password,
                }),
            });

            const response = await request.json();
            setData(response.message);
            setRequestsent(false);
        }
        catch (error) {
            console.error(error);
            setData('Could not Submit request');
            setRequestsent(false);
        }
    }
    return (
        <div id="parent">
            <div id='container'>
                <div id="child">
                    <form onSubmit={Submit}>
                        <label>Enter Username</label><br />
                        <input type='text' onChange={getValue(setUserName)} required /><br />
                        <label>Enter Age</label><br />
                        <input type='number' onChange={getIntegerValue(setAge)} required min={18} /><br />
                        <label>Enter Username</label><br />
                        <input type='password' onChange={getValue(setPassword)} required /><br />
                        <button>Sign Up  {requestsent && <span id="spinner"></span>}</button>
                    </form>
                </div>
                {data && <h2 id="data">{data}</h2>}
            </div>
        </div>
    )
}
export default Signup