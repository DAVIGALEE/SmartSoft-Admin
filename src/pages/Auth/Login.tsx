import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const authContext = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string>('');

    if (!authContext) {
        throw new Error('LoginPage must be used within an AuthProvider');
    }
    const { login } = authContext;

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormInputs) => {
        setErrorMessage('');
        if (data.username === "user" && data.password === "password") {
            login();
        } else {
            setErrorMessage("Invalid username or password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>
                        Please enter your credentials to sign in to the admin dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        {errorMessage && <p className="text-red-500 text-center text-sm">{errorMessage}</p>}
                        <Button type="submit" className="w-full">Sign In</Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
