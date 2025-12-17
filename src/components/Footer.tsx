export default function Footer() {
  return (
    <footer className="mt-auto bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-inner">
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}
