import { useState } from "react"
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import clsx from "clsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginReg()
{
    const navigate = useNavigate();
    const [formData, setformData] = useState({
        useremail: "",
        password: "",
        confirmPassword: ""
    })


    function handleChange(e) {
        setformData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    


    const [displayRegisterForm, setDisplayRegisterForm] = useState(true);
    const [displayLoginForm ,setDisplayLoginForm] = useState(false);
    function handleFormSwitch() {
        // Switch between login and registration forms
        // display none on confirm password
        setDisplayRegisterForm((prevValue)=>!prevValue);
        setDisplayLoginForm((prevValue)=>!prevValue);
    }


    const [istouched, setIsTouched] = useState({});
    function handleBlur(event)
    {
        const {name} = event.target;
        setIsTouched((prevData)=>{
            return {
                ...prevData,
                [name]: true
            }
        })
    }


    const password_match_result = istouched.confirmPassword ?  formData.confirmPassword === formData.password : "";
    const match_err_msg = !password_match_result  && istouched.confirmPassword ? "Passwords do not match" : "";


    const [successMsg, setSuccessMsg] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        try {
            if (displayLoginForm)
            {
                const response = await axios.post("http://localhost:5001/login", formData);
                console.log("Login successful:", response.data);
                localStorage.setItem("user_id", response.data.data.user_id);
                localStorage.setItem("user_email", response.data.data.useremail);
                localStorage.setItem("user_role", response.data.data.role);
                localStorage.setItem("token", response.data.data.token);
                navigate("/bug");
            }
            if (displayRegisterForm)
            {
                const response = await axios.post("http://localhost:5001/register", formData);
                console.log("Registration successful:", response.data);
                if (response.data.success) {
                    setSuccessMsg("Registration successful! Now Login to continue.");
                    setTimeout(() => {
                        setSuccessMsg("");
                    }, 20000);
                } else {
                    setSuccessMsg(response.data.msg);
                }
            }
        } catch (error) {
            console.error("Error during registration:", error);
        }
    }

    return (
        <section className="w-full">
            <div className="flex flex-col items-center mt-[100px]">
                <div className="flex flex-row my-[10px] justify-between bg-sky-300  w-[450px] rounded-[30px] shadow-[0px_0px_10px_black]">
                    <button onClick={handleFormSwitch} className={clsx(displayRegisterForm ? "opacity-[1] text-black" : "opacity-[0.5] bg-slate-400 text-white ", "py-2 px-4 w-1/2 rounded-[30px]")}>Register</button>
                    <button onClick={handleFormSwitch} className={clsx(displayLoginForm ? "opacity-[1]": "opacity-[0.5] bg-slate-400", 'text-black py-2 px-4 w-1/2 rounded-[30px]')}>Login</button>
                </div>
                <form className={clsx(displayRegisterForm ? "block" : "hidden", "bg-white p-8 rounded-lg shadow-[0px_0px_10px_black] w-[450px] mx-auto flex flex-col gap-6")} onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 shadow-[0px_0px_3px_black] rounded-md py-[5px] px-2">
                        <FaUser className="" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            className="pl-10 pr-4 py-2 w-full  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="useremail"
                            value={formData.useremail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex  flex-row items-center gap-2 shadow-[0px_0px_3px_black] rounded-md py-[5px] px-2">
                        <RiLockPasswordFill className="" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="pl-10 pr-4 py-2 w-full  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                    <div className="flex flex-row items-center gap-2 shadow-[0px_0px_3px_black] rounded-md py-[5px] px-2">
                        <RiLockPasswordFill className="" size={20} />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="pl-10 pr-4 py-2 w-full  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onBlur={handleBlur}
                            name="confirmPassword"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {
                        match_err_msg && (<p className="text-red-500">{match_err_msg}</p>)
                    }
                    <input
                        type="submit"
                        value="submit"
                        className="bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
                    />
                </form>
                <form className={clsx(displayLoginForm ? "block" : "hidden", "bg-white p-8 rounded-lg shadow-[0px_0px_10px_black] w-[450px] mx-auto flex flex-col gap-6")} onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 shadow-[0px_0px_3px_black] rounded-md py-[5px] px-2">
                        <FaUser className="" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            className="pl-10 pr-4 py-2 w-full  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="useremail"
                            value={formData.useremail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex  flex-row items-center gap-2 shadow-[0px_0px_3px_black] rounded-md py-[5px] px-2">
                        <RiLockPasswordFill className="" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="pl-10 pr-4 py-2 w-full  rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                    </div>
                    <input
                        type="submit"
                        value="Login"
                        className="bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
                    />
                </form>
                {
                    successMsg && (
                        <p className="text-green-500 mt-4">{successMsg}</p>
                    )   
                }
            </div>
        </section>
    )
}