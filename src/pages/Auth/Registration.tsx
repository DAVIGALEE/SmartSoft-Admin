import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

const registrationSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegistrationFormInputs = z.infer<typeof registrationSchema>;

const RegistrationPage = () => {
    const authContext = useContext(AuthContext);
    const [successMessage, setSuccessMessage] = useState<string>('');

    if (!authContext) {
        throw new Error('RegistrationPage must be used within an AuthProvider');
    }
    const { login } = authContext;

    const { register, handleSubmit, watch, formState: { errors, dirtyFields } } = useForm<RegistrationFormInputs>({
        resolver: zodResolver(registrationSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: ""
        }
    });

    const watchedValues = watch();

    const onSubmit = (data: RegistrationFormInputs) => {
        setSuccessMessage('');
        console.log("Registration Data:", data);
        login();
        setSuccessMessage("Registration successful! You are now logged in.");
    };

    const isFieldValid = (fieldName: keyof RegistrationFormInputs) => {
        return dirtyFields[fieldName] && !errors[fieldName];
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Create Your Account</CardTitle>
                    <CardDescription>
                        Join the admin platform and start managing your data securely.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="flex items-center justify-between">
                                Username
                                {isFieldValid('username') &&
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                }
                            </Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    className={`${errors.username ? 'border-red-300 pr-10' : ''} 
                                              ${isFieldValid('username') ? 'border-green-300' : ''}`}
                                    {...register("username")}
                                />
                                   {errors.username && dirtyFields.username && (
                                       <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                   )}
                            </div>
                            {errors.username && dirtyFields.username && (
                                <p className="text-red-500 text-sm">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center justify-between">
                                Password
                                   {isFieldValid('password') &&
                                       <CheckCircle className="h-4 w-4 text-green-500" />
                                   }
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    className={`${errors.password ? 'border-red-300 pr-10' : ''} 
                                              ${isFieldValid('password') ? 'border-green-300' : ''}`}
                                    {...register("password")}
                                />
                                {errors.password && dirtyFields.password && (
                                    <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                            </div>
                            {errors.password && dirtyFields.password && (
                                <p className="text-red-500 text-sm">{errors.password.message}</p>
                            )}
                            {dirtyFields.password && watchedValues.password && !errors.password && (
                                <p className="text-green-500 text-sm">Password meets requirements</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="flex items-center justify-between">
                                Confirm Password
                                {isFieldValid('confirmPassword') &&
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                }
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className={`${errors.confirmPassword ? 'border-red-300 pr-10' : ''} 
                                              ${isFieldValid('confirmPassword') ? 'border-green-300' : ''}`}
                                    {...register("confirmPassword")}
                                />
                                {errors.confirmPassword && dirtyFields.confirmPassword && (
                                    <AlertCircle className="h-4 w-4 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                )}
                            </div>
                            {errors.confirmPassword && dirtyFields.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                            )}
                            {dirtyFields.confirmPassword && !errors.confirmPassword && watchedValues.confirmPassword && (
                                <p className="text-green-500 text-sm">Passwords match</p>
                            )}
                        </div>

                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Register
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegistrationPage;