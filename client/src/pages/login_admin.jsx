import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginAdmin() {
    const [formData, setFormData] = useState({
        useremail: "",
        password: "",
        role: "admin", // Assuming the role is always admin for this login
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Form Data:", formData);
        try {
            const response = await axios.post("http://localhost:5001/logadmin", formData);
            if (response.data.success) {

                // Redirect to admin page or perform other actions
                navigate("/admin_page");
            } else {
                alert("Login failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-700">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Admin Login</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 dark:text-white mb-2">
                        Email
                    </label>
                    <input
                        type="text"
                        name="useremail"
                        id="useremail"
                        value={formData.useremail}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                        autoComplete="username"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 dark:text-white mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                        autoComplete="current-password"
                    />
                </div>
                <input
                    type="submit"
                    value="submit"
                    className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer font-semibold"
                />
            </form>
        </div>
    );
};

export default LoginAdmin;