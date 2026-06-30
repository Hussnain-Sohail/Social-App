import { useState, createContext } from "react";
import type { PropsWithChildren } from 'react'

type Token = {
    accessToken: string,
    setAccessToken: React.Dispatch<React.SetStateAction<string>>
}
const AuthProvider = createContext<Token | null>(null);
function AccessTokenProvider({ children }: PropsWithChildren) {
    const [accessToken, setAccessToken] = useState('');
    return (
        <AuthProvider.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </AuthProvider.Provider>
    )
}

export { AuthProvider };
export default AccessTokenProvider;