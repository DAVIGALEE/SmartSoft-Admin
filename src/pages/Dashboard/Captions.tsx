import { useContext, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, LogOut, Loader2, AlertCircle, CheckCircle, XCircle, Heart, RefreshCw } from "lucide-react";
import { captionsActions, Word, AddWordRequest, EditWordRequest } from '@/actions/captions.actions';

const wordSchema = z.object({
    national: z.string()
        .min(1, 'National word is required')
        .min(2, 'National word must be at least 2 characters')
        .max(100, 'National word must be less than 100 characters'),
    foreign: z.string()
        .min(1, 'Foreign word is required')
        .min(2, 'Foreign word must be at least 2 characters')
        .max(100, 'Foreign word must be less than 100 characters'),
});

type WordFormData = z.infer<typeof wordSchema>;

interface Message {
    type: 'success' | 'error';
    text: string;
}

const CaptionsPage = () => {
    const authContext = useContext(AuthContext);

    const form = useForm<WordFormData>({
        resolver: zodResolver(wordSchema),
        defaultValues: {
            national: '',
            foreign: '',
        },
    });

    const editForm = useForm<WordFormData>({
        resolver: zodResolver(wordSchema),
        defaultValues: {
            national: '',
            foreign: '',
        },
    });

    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingWord, setEditingWord] = useState<Word | null>(null);

    if (!authContext) {
        throw new Error('CaptionsPage must be used within an AuthProvider');
    }

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        loadWords();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
    };

    const loadWords = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await captionsActions.getAllWords();
            setWords(response.words);
        } catch (err) {
            const errorMessage = `Failed to load words: ${err instanceof Error ? err.message : 'Unknown error'}`;
            setError(errorMessage);
            showMessage('error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onSubmit = async (data: WordFormData) => {
        try {
            setIsLoading(true);
            const newWordData: AddWordRequest = {
                national: data.national.trim(),
                foreign: data.foreign.trim()
            };

            await captionsActions.addWord(newWordData);
            showMessage('success', 'Word added successfully!');
            form.reset();
            await loadWords();
        } catch (err) {
            console.log('Error adding word:', err);
            showMessage('error', 'Failed to add word. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (word: Word) => {
        setEditingWord(word);
        editForm.reset({
            national: word.national,
            foreign: word.foreign
        });
        setIsEditDialogOpen(true);
    };

    const onEditSubmit = async (data: WordFormData) => {
        if (!editingWord) return;

        try {
            setIsLoading(true);
            const updateData: EditWordRequest = {
                national: data.national.trim(),
                foreign: data.foreign.trim()
            };

            await captionsActions.editWord(editingWord._id, updateData);
            showMessage('success', 'Word updated successfully!');
            handleEditDialogClose();
            await loadWords();
        } catch (err) {
            console.log('Error updating word:', err);
            showMessage('error', 'Failed to update word. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = async (word: Word) => {
        if (!window.confirm(`Are you sure you want to delete "${word.national}"?`)) {
            return;
        }

        try {
            setIsLoading(true);
            await captionsActions.deleteWord(word._id);
            showMessage('success', 'Word deleted successfully!');
            await loadWords();
        } catch (err) {
            console.log('Error deleting word:', err);
            showMessage('error', 'Failed to delete word. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false);
        setEditingWord(null);
        editForm.reset();
    };

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-foreground mb-2">
                            Word Translations
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Manage your word translations and vocabulary
                        </p>
                    </div>
                </div>

                {message && (
                    <Alert className={`mb-6 ${
                        message.type === 'success'
                            ? 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300'
                            : ''
                    }`} variant={message.type === 'error' ? 'destructive' : 'default'}>
                        {message.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}
                        <AlertDescription className="ml-2 font-medium">
                            {message.text}
                        </AlertDescription>
                        <button
                            onClick={() => setMessage(null)}
                            className="ml-auto !text-current opacity-70 hover:opacity-100 p-1 rounded hover:!bg-black/10 dark:hover:!bg-white/10 transition-all"
                        >
                            ×
                        </button>
                    </Alert>
                )}

                {error && (
                    <Alert className="mb-6" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Add New Word</CardTitle>
                        <CardDescription>
                            Add a new word translation to your vocabulary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="national"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>National Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Hello"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="foreign"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Foreign Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., გამარჯობა"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto !bg-blue-600 hover:!bg-blue-700 !text-white !border-blue-600 hover:!border-blue-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin !text-white" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2 !text-white" />
                                            Add Word
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>All Words</CardTitle>
                                <CardDescription>
                                    Manage your existing word translations
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadWords}
                                disabled={isLoading}
                                className="!border-gray-300 !text-gray-700 hover:!bg-gray-50 hover:!text-gray-900 dark:!border-gray-600 dark:!text-gray-300 dark:hover:!bg-gray-800 dark:hover:!text-gray-100"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''} !text-current`} />
                                Refresh
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading && words.length === 0 ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                                <p className="text-muted-foreground">Loading your words...</p>
                            </div>
                        ) : words.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                                    <Plus className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground mb-2">No words found</p>
                                <p className="text-sm text-muted-foreground/70">Add your first word translation above!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/2">National Language</TableHead>
                                            <TableHead className="w-1/3">Foreign Language</TableHead>
                                            <TableHead className="w-1/6 text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {words.map((word) => (
                                            <TableRow key={word._id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {word.national}
                                                        {word.isFavorite && (
                                                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {word.foreign}
                                                    {word.inSentences.length > 0 && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                                                            {word.inSentences.length} sentence{word.inSentences.length !== 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditClick(word)}
                                                            disabled={isLoading}
                                                            aria-label={`Edit ${word.national}`}
                                                            className="!border-blue-300 !text-white !bg-blue-800 hover:!bg-blue-50 hover:!text-blue-800 hover:!border-blue-400 dark:!border-blue-600 dark:!text-blue-400 dark:hover:!bg-blue-900/20 dark:hover:!text-blue-300"
                                                        >
                                                            <Pencil className="w-4 h-4 !text-current" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(word)}
                                                            disabled={isLoading}
                                                            className="!border-red-300 !text-white !bg-red-800 hover:!bg-red-50  hover:!text-red-800 hover:!border-red-400 dark:!border-red-600 dark:!text-red-400 dark:hover:!bg-red-900/20 dark:hover:!text-red-300"
                                                            aria-label={`Delete ${word.national}`}
                                                        >
                                                            <Trash2 className="w-4 h-4 !text-current" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Word Translation</DialogTitle>
                            <DialogDescription>
                                Update the word translation. All fields are required.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Form {...editForm}>
                                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                                    <FormField
                                        control={editForm.control}
                                        name="national"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>National Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Hello"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={editForm.control}
                                        name="foreign"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Foreign Language</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., გამარჯობა"
                                                        disabled={isLoading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={handleEditDialogClose}
                                disabled={isLoading}
                                className="!border-gray-300 !text-gray-700 hover:!bg-gray-50 hover:!text-gray-900 dark:!border-gray-600 dark:!text-gray-300 dark:hover:!bg-gray-800 dark:hover:!text-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={editForm.handleSubmit(onEditSubmit)}
                                disabled={isLoading}
                                className="!bg-green-600 hover:!bg-green-700 !text-white !border-green-600 hover:!border-green-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin !text-white" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default CaptionsPage;