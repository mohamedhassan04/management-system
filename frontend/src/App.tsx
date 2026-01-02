import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./apis/utils/ProtectedRoute";
import { notification } from "antd";
import Estimate from "./screens/estimate/Estimate";
import Dashboard from "./screens/dashboard/Dashboard";

const Login = lazy(() => import("./screens/login/Login"));
const Clients = lazy(() => import("./screens/users/Clients"));
const Products = lazy(() => import("./screens/products/Products"));
const Suplliers = lazy(() => import("./screens/suplliers/Suplliers"));
const Invoice = lazy(() => import("./screens/invoice/Invoice"));

function App() {
  const [api, contextHolder] = notification.useNotification();
  return (
    <>
      {contextHolder}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Login api={api} />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard api={api} />} />
            <Route path="/users" element={<Clients api={api} />} />
            <Route path="/products" element={<Products api={api} />} />
            <Route path="/invoices" element={<Invoice api={api} />} />
            <Route path="/devis" element={<Estimate api={api} />} />
            <Route path="/suplliers" element={<Suplliers api={api} />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
