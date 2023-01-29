import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
