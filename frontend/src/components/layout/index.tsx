import Footer from "./footer/index.tsx";
import Main from "./main/index.tsx";
import Nav from "./nav/index.tsx";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen">
      <Nav />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
}
