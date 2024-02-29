import Logout from '@/components/layout/header/logout';
import { validateRequest } from '@/server/auth/methods';

export default async function Header() {
    const isLoggedIn = await validateRequest();

    return (
        <header className="fixed top-0 left-0 flex w-full px-4 py-4">
            <nav className="ml-auto">{isLoggedIn.user ? <Logout /> : null}</nav>
        </header>
    );
}
