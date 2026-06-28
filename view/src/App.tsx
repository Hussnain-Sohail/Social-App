import Signup from "./Signup.tsx";
import Login from './Login.tsx';
import { Route, Routes } from 'react-router-dom';
function App() {
    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}
export default App
