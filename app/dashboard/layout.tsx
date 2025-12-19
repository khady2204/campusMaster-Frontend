export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-900 text-white">
                {/* Sidebar */}
            </aside>
            
            <div className="flex-1 flex flex-col">
                <nav className="bg-white shadow h-16">
                {/* Navbar */}
                </nav>
                
                <main className="flex-1 overflow-auto p-6">
                {children}
                </main>
            </div>
        </div>
    );
}