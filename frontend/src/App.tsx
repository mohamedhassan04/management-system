import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import DashboardLayout from "./layout/DashboardLayout";

const Login = lazy(() => import("./screens/login/Login"));

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/users" element={<h1>Clients</h1>} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
