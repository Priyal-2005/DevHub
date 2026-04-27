import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;
