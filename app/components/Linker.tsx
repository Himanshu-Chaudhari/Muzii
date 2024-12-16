import { Music, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export function Linker(){
    // const router=useRouter()
    return (
        <nav className="space-y-4">
            <Link href="/createStream" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <Music className="h-5 w-5" />
                <span>Create Stream</span>
            </Link>
            <Link href="/joinStream" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                <Users className="h-5 w-5" />
                <span>Join Stream</span>
            </Link>
        </nav>
    )
}