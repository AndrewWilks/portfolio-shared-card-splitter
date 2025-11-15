export default function Footer() {
  return (
    <footer className="w-full p-4 bg-gray-200 dark:bg-gray-800 text-center">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="http://andrewwilks.au"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:underline font-medium cursor-pointer"
        >
          Andrew Wilks
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
