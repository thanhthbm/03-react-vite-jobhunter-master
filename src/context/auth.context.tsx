import Loading from "@/components/share/loading";
import { callFetchAccount } from "@/config/api";
import { IGetAccount } from "@/types/backend";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

interface IAuthContext {
    isAuthenticated: boolean;
    user: IGetAccount['user'] | null;
    isLoading: boolean;
    refetchAccount: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['account'],
        queryFn: async () => {
            const res = await callFetchAccount();
            return res.data; 
        },
        retry: false,
    });

    const user = data?.user || null;
    const isAuthenticated = !!user?.id;

    if (isLoading && window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        return <Loading />; 
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, refetchAccount: refetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};