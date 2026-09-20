import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <p className="text-6xl font-bold text-primary-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          Back to the benefits directory
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search benefits
        </Link>
      </div>
    </div>
  );
}
