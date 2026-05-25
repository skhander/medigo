import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-500 text-white transition group-hover:bg-sage-600">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </span>
          <span className="text-xl font-semibold tracking-tight text-ink">
            Medi<span className="text-sage-500">Go</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-muted sm:flex">
          <Link href="/" className="transition hover:text-ink">
            Browse clinics
          </Link>
          <a href="#how-it-works" className="transition hover:text-ink">
            How it works
          </a>
        </nav>
      </div>
    </header>
  );
}
