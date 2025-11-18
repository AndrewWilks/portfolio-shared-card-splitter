import Footer from "../components/blocks/footer/index.tsx";
import Main from "../components/blocks/main/index.tsx";
import Nav from "../components/blocks/nav/index.tsx";

export default function StackedLayout({
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
