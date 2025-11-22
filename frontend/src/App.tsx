import { Routes, Route } from "react-router-dom";
import Login from "./screens/login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
