import { useContext } from 'react';
import {AuthContext} from "@/contexts/AuthContext.tsx";
import {Button} from "@/components/ui/button.tsx";

const CaptionsPage = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('CaptionsPage must be used within an AuthProvider');
    }
    const { logout } = authContext;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Captions Page</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome to the captions section!</p>
            <Button onClick={logout} className="bg-red-600 hover:bg-red-700">Logout</Button>
        </div>
    );
};

export default CaptionsPage;
