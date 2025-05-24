import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!authContext) {
        throw new Error('RegistrationPage must be used within an AuthProvider');
    }
    const { register: registerUser } = authContext;

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

    const onSubmit = async (data: RegistrationFormInputs) => {
        setErrorMessage('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const success = await registerUser({
                username: data.username,
                password: data.password
            });
                console.log('hi',success)
            if (success) {
                setSuccessMessage("Registration successful! Redirecting to dashboard...");
                setTimeout(() => {
                    navigate('/captions');
                }, 1500);
            } else {
                setErrorMessage("Registration failed. Please try a different username.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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

                        {errorMessage && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                {successMessage}
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
                                    Creating Account...
                                </>
                            ) : (
                                'Register'
                            )}
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