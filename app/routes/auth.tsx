import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export const meta = () => {
    return [
        {title: "Resumind | Auth"},
        {name: "description", content: "Login to your account." },
    ]
};

const auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();
    const next = location.search.split("next=")[1]

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="bg-white rounded-2xl flex flex-col gap-8 p-10">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <h1>Welcome</h1>
                        <h2>Login to your account and find your dream job</h2>
                    </div>
                    <div>
                        {
                            isLoading ? (
                                <button className="auth-button animate-pulse">Signing you in...</button>
                            ) : (
                                auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log in</p>
                                    </button>
                                )
                            )
                        }
                    </div>
                </section>
            </div>
        </main>
    );
}

export default auth;