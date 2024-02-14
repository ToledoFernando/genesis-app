import { ThemeProvider } from "@mui/material";
import { theme } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Home from "./pages/Home";
import CreateUser from "./pages/CreateUser";
import AllHistories from "./pages/AllHistories";
import DetailClient from "./pages/DetailClient"
import Config from "./pages/Config"
import Personal from "./pages/Personal"
import CreatePersonal from "./pages/CreatePersonal"

function App() {
  return (
    <div className="bg-gray-100 h-screen w-screen gap-4 flex overflow-hidden">
      <Toaster position="top-left" toastOptions={{style: {boxShadow: "0px 5px 15px #00000054"}}}/>
      <ThemeProvider theme={theme}>
        <SideBar />
        <div className="w-full overflow-auto scroll-act">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create_user" element={<CreateUser />} />
            <Route path="/all_histories" element={<AllHistories />} />
            <Route path="/detail/:id" element={<DetailClient />} />
            <Route path="/settings" element={<Config />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/personal/create" element={<CreatePersonal />} />
          </Routes>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
