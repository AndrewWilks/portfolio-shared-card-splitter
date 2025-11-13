export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="col-span-1 overflow-auto overscroll-contain">
      {children}
    </main>
  );
}
