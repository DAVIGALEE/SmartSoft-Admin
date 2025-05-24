import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const authContext = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!authContext) {
        throw new Error('LoginPage must be used within an AuthProvider');
    }
    const { login } = authContext;

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setErrorMessage('');
        setIsLoading(true);

        try {
            const { success, message } = await login({
                username: data.username,
                password: data.password
            });

            if (success) {
                navigate('/captions');
            } else {
                setErrorMessage(message);
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
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
                            <Input
                                id="username"
                                {...register("username")}
                                disabled={isLoading}
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;