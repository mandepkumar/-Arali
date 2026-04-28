import { Navbar } from "@/components/Navbar/Navbar.tsx";
import { CustomersPage } from "@/features/customers/CustomersPage.tsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <CustomersPage />
      </main>
    </div>
  );
}
