import { Button } from "@/components/ui/button"
import { Radio, Music, Users, LogOut } from "lucide-react"
import Link from "next/link"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<div >
        <div className=" hidden lg:block">
            <div className="flex h-screen w-screen bg-gray-900 text-gray-100">
                <aside className="w-64 bg-gray-800 p-4">
                    <div className="flex items-center mb-8">
                        <Radio className="h-6 w-6 text-emerald-500" />
                        <span className="ml-2 text-xl font-bold">MixMaster</span>
                    </div>
                    <nav className="space-y-4">
                        <Link href="/dashboard/createSpace" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                            <Music className="h-5 w-5" />
                            <span>Create Stream</span>
                        </Link>
                        <Link href="/dashboard/joinSpace" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                            <Users className="h-5 w-5" />
                            <span>Join Stream</span>
                        </Link>
                        <Link href="/dashboard/mySpace" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                            <Users className="h-5 w-5" />
                            <span>My Stream</span>
                        </Link>
                    </nav>
                </aside>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>

        <div className="block lg:hidden">
            <div className="flex flex-col h-screen w-screen bg-gray-900 text-gray-100">
                <header className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Radio className="h-6 w-6 text-emerald-500" />
                            <span className="text-xl font-bold">MixMaster</span>
                        </div>
                        <div>
                            <label htmlFor="menu-toggle" className="text-gray-300 text-4xl hover:text-white cursor-pointer">
                                ☰
                            </label>
                            <input type="checkbox" id="menu-toggle" className="hidden peer" />
                            <nav className="absolute right-4 top-16 bg-gray-800 rounded-md shadow-md hidden peer-checked:flex flex-col space-y-2 p-4 w-48">
                                <Link href="/dashboard/createSpace" className="text-gray-300 hover:text-white">
                                    Create Stream
                                </Link>
                                <Link href="/dashboard/joinSpace" className="text-gray-300 hover:text-white">
                                    Join Stream
                                </Link>
                                <Link href="/dashboard/mySpace" className="text-gray-300 hover:text-white">
                                    My Stream
                                </Link>
                            </nav>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    </div>

    );
}
