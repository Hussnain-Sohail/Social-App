import { useState, type SetStateAction } from "react";
import '../css/Signup.css'
export function Signup() {
    const [userName, setUserName] = useState('');
    const [age, setAge] = useState(18);
    const [password, setPassword] = useState('');
    const [data, setData] = useState('');

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
        }
        catch (error) {
            console.error(error);
            setData('Could not Submit request');
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
                        <button>Sign Up</button>
                    </form>
                    {data && <p>{data}</p>}
                </div>
            </div>
        </div>
    )
}
// background-color: #9F9FFF;
//color: white;