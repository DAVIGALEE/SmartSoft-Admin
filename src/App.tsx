import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import LoginPage from "@/pages/Auth/Login.tsx";
import RegistrationPage from "@/pages/Auth/Registration.tsx";
import { PrivateRoute } from "@/navigation/PrivateRoute.tsx";
import CaptionsPage from "@/pages/Dashboard/Captions.tsx";
import CountriesPage from "@/pages/Dashboard/Countries.tsx";
import { AuthLayout } from './pages/Auth/Layout';
import {DashboardLayout} from "@/pages/Dashboard/Layout.tsx";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-800">
                    <main className="flex-grow py-10">
                        <AuthProvider>
                            <Routes>
                                <Route element={<AuthLayout />}>
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegistrationPage />} />
                                </Route>
                                <Route element={
                                    <PrivateRoute>
                                        <DashboardLayout />
                                    </PrivateRoute>
                                }>
                                    <Route path="/captions" element={<CaptionsPage />} />
                                    <Route path="/countries" element={<CountriesPage />} />
                                </Route>
                                <Route path="/" element={<Navigate to="/login" />} />
                            </Routes>
                        </AuthProvider>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
