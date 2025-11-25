import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./apis/utils/ProtectedRoute";

const Login = lazy(() => import("./screens/login/Login"));
const Clients = lazy(() => import("./screens/users/Clients"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/users" element={<Clients />} />
          <Route path="/products" element={<h1>Produits</h1>} />
          <Route path="/invoices" element={<h1>Factures</h1>} />
          <Route path="/devis" element={<h1>Devis</h1>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
