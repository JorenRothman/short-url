import Logout from "@/components/layout/header/logout";
import { getUser } from "@/server/auth/methods";
import Image from "next/image";
import Link from "next/link";
import githubLogo from "@/assets/github-mark-white.svg";

export default async function Header() {
    const user = await getUser();

    return (
        <header className="fixed left-0 top-0 flex w-full px-4 py-4">
            <nav className="ml-auto flex items-center gap-6">
                <Link
                    target="_blank"
                    href="https://github.com/JorenRothman/short-url"
                >
                    <Image
                        src={githubLogo}
                        alt="GitHub Logo"
                        width={24}
                        height={24}
                    />
                </Link>
                {user ? <Logout /> : null}
            </nav>
        </header>
    );
}
