import { AuthProvider } from "./AccessTokenProvider";
import { useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
function Protect({ children }: PropsWithChildren) {
    const [forward, setForward] = useState<boolean>(false);
    const context = useContext(AuthProvider);

    const { accessToken, setAccessToken } = context!;

    const getNewAccessToken = async () => {
        try {
            if (accessToken) {
                return { children };
            }
            const request = await fetch('http://localhost:3500/newaccesstoken', {
                method: 'POST',
            });
            const response = await request.json();
            setAccessToken(response.accessToken);
            setForward(true);
        }
        catch (error) {
            console.error(error);
            setForward(false);
        }
    }
    useEffect(() => {
        getNewAccessToken();
    }, []);
    return (
        forward === true ? { children } : <h1>Loading....... Please Wait</h1>
    )
}
export default Protect;