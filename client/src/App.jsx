import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header.jsx";
import LoginReg from "./pages/user_login_registration.jsx";
import BugPage from "./pages/report_bug_page.jsx";
import AdminPage from "./pages/adminPage.jsx";
export default function App()
{
    const[darkMode, setDarkMode] = useState("");

    useEffect(()=>{
        const themeResult = window.matchMedia("(prefers-color-scheme:dark)").matches
        console.log(themeResult);
        setDarkMode(themeResult);
    },[])
      
      const bg = darkMode ? "dark": ""
      console.log(`bg is : ${bg}`)
    return (
        <div className={`${bg} dark:bg-slate-900 bg-white min-h-screen`}>
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<div><Header/><Outlet/></div>}>
                    <Route index element={<h1 className="text-2xl text-center dark:text-white">Welcome to BugAppTracker</h1>} />
                    <Route path="register" element={<LoginReg />} />
                    <Route path="services" element={<h1 className="text-2xl text-center dark:text-white">Our Services</h1>} />
                    <Route path="*" element={<h1 className="text-2xl text-center dark:text-white">404 Not Found</h1>} />
                    <Route path="bug" element={<BugPage />}/>
                    <Route path="admin" element={<AdminPage/>}/>
                </Route>
            </Routes>
            </BrowserRouter>
        </div>
    )
}


 