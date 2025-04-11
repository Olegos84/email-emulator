import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InboxPage from "./pages/InboxPage";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <Routes>
            <Route path="/" element={<Navigate to={token ? "/inbox" : "/login"} />} />
            <Route path="/login" element={<Navigate to={token ? "/inbox" : "/login"} />} />
            <Route
                path="/inbox"
                element={
                    <ProtectedRoute>
                        <InboxPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
