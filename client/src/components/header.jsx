import { NavLink } from "react-router-dom"

export default function Header()
{
    
    return (
        <header className="bg-gray-800 text-white p-4 flex flex-col md:flex-row items-center justify-between shadow-md">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">BugAppTracker</h1>
            <ul className="flex gap-4 items-center">
                <li>
                    <NavLink
                        to="/"
                        className="hover:text-yellow-400 transition-colors"
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/register"
                        className="hover:text-yellow-400 transition-colors"
                    >
                        Register
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/services"
                        className="hover:text-yellow-400 transition-colors"
                    >
                        Services
                    </NavLink>
                </li>
                <li>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors">
                        Logout
                    </button>
                </li>
            </ul>
        </header>
    )
}