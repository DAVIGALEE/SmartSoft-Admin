import { useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { countriesActions, Country } from '@/actions/countries.actions';

const ITEMS_PER_PAGE = 15;

const CountriesPage = () => {
    const authContext = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const isInitialMount = useRef(true);
    const prevFilters = useRef({
        independentFilter: searchParams.get('independent') === 'true',
        currencyFilter: searchParams.get('currency') || 'all'
    });

    const independentFilter = searchParams.get('independent') === 'true';
    const currencyFilter = searchParams.get('currency') || 'all';

    if (!authContext) {
        throw new Error('CountriesPage must be used within an AuthProvider');
    }

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                const data = await countriesActions.getAllCountries();
                setCountries(data);
            } catch (err) {
                setError('Failed to load countries data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const filteredCountries = useMemo(() => {
        let filtered = [...countries];

        if (independentFilter) {
            filtered = filtered.filter(country => country.independent);
        }

        if (currencyFilter && currencyFilter !== 'all') {
            filtered = filtered.filter(country => {
                if (!country.currencies || typeof country.currencies !== 'object') {
                    return false;
                }

                const countryCurrencies = Object.keys(country.currencies);

                const hasCurrency = countryCurrencies.some(code =>
                    code && code.toUpperCase() === currencyFilter.toUpperCase()
                );

                return hasCurrency;
            });
        }

        return filtered;
    }, [countries, independentFilter, currencyFilter]);

    const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCountries = filteredCountries.slice(startIndex, endIndex);

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams();

        if (independentFilter) {
            params.set('independent', 'true');
        }

        if (currencyFilter && currencyFilter !== 'all') {
            params.set('currency', currencyFilter);
        }

        if (page > 1) {
            params.set('page', page.toString());
        }

        setSearchParams(params);
    }, [independentFilter, currencyFilter, setSearchParams]);

    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
        const validPage = Math.max(1, Math.min(pageFromUrl, totalPages || 1));
        setCurrentPage(validPage);

        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
    }, [searchParams, totalPages]);

    useEffect(() => {
        const filtersChanged =
            prevFilters.current.independentFilter !== independentFilter ||
            prevFilters.current.currencyFilter !== currencyFilter;

        if (!isInitialMount.current && filtersChanged) {
            const params = new URLSearchParams();

            if (independentFilter) {
                params.set('independent', 'true');
            }

            if (currencyFilter && currencyFilter !== 'all') {
                params.set('currency', currencyFilter);
            }

            setSearchParams(params);
            setCurrentPage(1);
        }

        prevFilters.current = { independentFilter, currencyFilter };
    }, [independentFilter, currencyFilter, setSearchParams]);

    const handleIndependentChange = (checked: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (checked) {
            params.set('independent', 'true');
        } else {
            params.delete('independent');
        }
        setSearchParams(params);
    };

    const handleCurrencyChange = (currency: string) => {
        const params = new URLSearchParams(searchParams);
        if (currency && currency !== 'all') {
            params.set('currency', currency);
        } else {
            params.delete('currency');
        }
        setSearchParams(params);
    };

    const getPrimaryLanguage = (languages: Record<string, string>) => {
        if (!languages || typeof languages !== 'object') return 'N/A';
        const languageValues = Object.values(languages);
        return languageValues[0] || 'N/A';
    };

    const getPrimaryCurrency = (currencies: Record<string, { name: string; symbol: string }>) => {
        if (!currencies || typeof currencies !== 'object') return 'N/A';

        const currencyEntries = Object.entries(currencies);
        if (currencyEntries.length === 0) return 'N/A';

        const [code, details] = currencyEntries[0];
        if (!code) return 'N/A';

        if (details && typeof details === 'object') {
            const symbol = details.symbol || '';
            return symbol ? `${code} (${symbol})` : code;
        }

        return code;
    };

    const getAllCurrencies = (currencies: Record<string, { name: string; symbol: string }>) => {
        if (!currencies || typeof currencies !== 'object') return 'N/A';
        return Object.keys(currencies).join(', ') || 'N/A';
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="text-xl text-gray-600">Loading countries...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="text-xl text-red-600 mb-4">{error}</div>
                <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-800">Countries Page</h1>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Filters</h2>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="independent"
                                checked={independentFilter}
                                onChange={(e) => handleIndependentChange(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="independent" className="text-sm font-medium text-gray-700">
                                Independent Countries Only
                            </label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label htmlFor="currency" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                Currency:
                            </label>
                            <Select value={currencyFilter} onValueChange={handleCurrencyChange}>
                                <SelectTrigger className="w-[140px] sm:w-[160px]">
                                    <SelectValue placeholder="All Currencies" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Currencies</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4 space-y-1">
                        <div className="text-sm text-gray-600">
                            Showing {filteredCountries.length} countries
                            {(independentFilter || (currencyFilter && currencyFilter !== 'all')) && ` (filtered from ${countries.length} total)`}
                        </div>
                        {currencyFilter && currencyFilter !== 'all' && (
                            <div className="text-xs text-blue-600">
                                Filtering by currency: {currencyFilter}
                            </div>
                        )}
                        {independentFilter && (
                            <div className="text-xs text-green-600">
                                Showing independent countries only
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="hidden sm:block">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Region
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Country
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Capital
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Primary Currency
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        All Currencies
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Language
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Independent
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {currentCountries.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                            No countries found matching the current filters.
                                            {currencyFilter && currencyFilter !== 'all' && (
                                                <div className="mt-2 text-sm">
                                                    Try selecting a different currency or remove the currency filter.
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    currentCountries.map((country, index) => (
                                        <tr key={country.cca3} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {country.region}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-2">{country.flag}</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {country.name.common}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {country.capital?.[0] || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getPrimaryCurrency(country.currencies)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {getAllCurrencies(country.currencies)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getPrimaryLanguage(country.languages)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    country.independent
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {country.independent ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div className="sm:hidden">
                            {currentCountries.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No countries found matching the current filters.
                                    {currencyFilter && currencyFilter !== 'all' && (
                                        <div className="mt-2 text-sm">
                                            Try selecting a different currency or remove the currency filter.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {currentCountries.map((country, index) => (
                                        <div key={`${country.cca3}-${index}`} className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-lg mr-2">{country.flag}</span>
                                                    <span className="font-medium text-gray-900">
                                                        {country.name.common}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    country.independent
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {country.independent ? 'Independent' : 'Not Independent'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="text-gray-500 block">Region:</span>
                                                    <span className="text-gray-900">{country.region}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Capital:</span>
                                                    <span className="text-gray-900">{country.capital?.[0] || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Primary Currency:</span>
                                                    <span className="text-gray-900">{getPrimaryCurrency(country.currencies)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 block">Language:</span>
                                                    <span className="text-gray-900">{getPrimaryLanguage(country.languages)}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-gray-500 text-sm block">All Currencies:</span>
                                                <span className="text-gray-700 text-sm">{getAllCurrencies(country.currencies)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="bg-white px-3 sm:px-6 py-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-sm text-gray-700 order-2 sm:order-1">
                                    <span>
                                        Showing {startIndex + 1} to {Math.min(endIndex, filteredCountries.length)} of{' '}
                                        {filteredCountries.length} results
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                                    <Button
                                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Prev
                                    </Button>

                                    <div className="hidden sm:flex items-center space-x-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <div className="sm:hidden text-sm text-gray-600">
                                        {currentPage} / {totalPages}
                                    </div>

                                    <Button
                                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs sm:text-sm"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountriesPage;