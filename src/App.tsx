import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import LoginPage from "@/pages/Auth/Login.tsx";
import RegistrationPage from "@/pages/Auth/Registration.tsx";
import { PrivateRoute } from "@/navigation/PrivateRoute.tsx";
import CaptionsPage from "@/pages/Dashboard/Captions.tsx";
import CountriesPage from "@/pages/Dashboard/Countries.tsx";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-800">
                    <main className="flex-grow py-10">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegistrationPage />} />
                            <Route path="/captions" element={<PrivateRoute><CaptionsPage /></PrivateRoute>} />
                            <Route path="/countries" element={<PrivateRoute><CountriesPage /></PrivateRoute>} />
                            <Route path="/" element={<Navigate to="/login" />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
