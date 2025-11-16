export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="col-span-1 overflow-auto overscroll-contain container mx-auto px-4 pt-4 pb-8">
      {children}
    </main>
  );
}
