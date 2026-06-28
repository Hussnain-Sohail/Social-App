import type { IUser } from '../../model/UserSchema.ts';
import { useState, useEffect } from 'react';
function UserAccount() {
    const [user, setUser] = useState<IUser | null>(null);
    const [data, setData] = useState('');

    const getAccountInformation = async () => {
        try {
            const request = await fetch('http://localhost:3500/useraccount', {
                method: 'POST',
            });

            const response = await request.json();
            setData(response.message);
            setUser(response.user);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAccountInformation();
    });

    return (
        <div>

        </div>
    )
}
export default UserAccount