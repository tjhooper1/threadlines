import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Nav */}
            <header className="border-b">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <span className="text-xl font-bold tracking-tight">Threadline</span>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" render={<Link href="/login" />}>
                            Sign in
                        </Button>
                        <Button render={<Link href="/signup" />}>
                            Get started
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                <h1 className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
                    Your life, understood.
                </h1>
                <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                    Threadline turns your life into a living, explorable identity map.
                    Understand your past, see your present clearly, and build your future
                    more intentionally.
                </p>
                <div className="mt-10 flex gap-4">
                    <Button size="lg" render={<Link href="/signup" />}>
                        Start your Threadline
                    </Button>
                    <Button size="lg" variant="outline" render={<Link href="/login" />}>
                        Sign in
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                Threadline &mdash; A living autobiography with intelligence.
            </footer>
        </div>
    );
}
