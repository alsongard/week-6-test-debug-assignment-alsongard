import { useState } from "react";
import axios from "axios";
import clsx  from "clsx";

export default function BugPage() 
{
    const user_id = localStorage.getItem("user_id");
    const user_email = localStorage.getItem("user_email");
    const user_role = localStorage.getItem("user_role");
    const [formData, setFormData] = useState({
        bugName: "",
        bugLevel: "",
        bugDescription: "",
        bugStatus: ""
    });
    // bugname, buglevel,bugStatus, bugDescription

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const [successMsg, setSuccessMsg] = useState("");
    const [displaySuccess, setDisplaySuccess] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Bug reported:", formData);
        try {
            const response = await axios.post("http://localhost:5001/bug", {
                bugname: formData.bugName,
                buglevel: formData.bugLevel,
                bugDescription: formData.bugDescription,
                bugStatus: formData.bugStatus,
                user_id: user_id // Replace with actual user ID
            });
            console.log("Bug submitted successfully:", response.data);
            if (response.data.success) {
                setSuccessMsg("Bug reported successfully!");
                setDisplaySuccess(true);
                setTimeout(() => {
                    setDisplaySuccess(false);
                    setSuccessMsg("");
                }, 10000);
            }
        } catch (error) {
            console.error("Error submitting bug:", error);
        }
    }
    const [viewAllBugs, setViewAllBugs] = useState(false);
    const [reportBug, setReportBug] = useState(false);

    const [bugData, setBugData] = useState({});
    const [displayBugData, setDisplayBugData] = useState(false);
    const [reportedBugs, setReportedBugs] = useState("");
    console.log(`User ID: ${user_id}`);
    async function HandleViewAllBugs(){
        // Logic to view all reported bugs
        setViewAllBugs(true);
        try {
            const response = await axios.get(`http://localhost:5001/getUserId/${user_id}`);
            console.log("Bugs fetched successfully:", response.data);
            console.log(response);
            if (!response.data.success)
            {
                setReportedBugs("No bugs found for the given user id");
                setTimeout(() => {
                    setReportedBugs("");
                }, 5000);
            }
            else
            {
                setBugData(response.data);
                console.log(bugData.length);
                setDisplayBugData(true);
            }
        } catch (error) {
            console.error("Error fetching bugs:", error);
        }
    }
    function HandleReportBug(){
        // Logic to report a new bug
        setReportBug(true);
    }
    function handleClear(){
        setReportBug(false);
        setViewAllBugs(false);
        setReportedBugs("");
        setDisplayBugData(false);
        setBugData({});
    }
    return (
        <section className="w-full">
            <div className='flex flex-col items-start ml-[10px]'>
                <p className='text-lg dark:text-white text-black'>User Email: {user_email}</p>
                <p className='text-lg dark:text-white text-black'>User Role: {user_role}</p>
            </div>
            <div className="flex flex-col items-center mt-[100px]">
                <h1 className="text-2xl text-center dark:text-white">Bug Page</h1>
                <p className="text-lg text-center dark:text-gray-300">This is where you can report bugs, view all bugs your reported.</p>
            </div>
            <div className='flex justify-center gap-4 mt-4 flex-row'>
                <button className='bg-amber-300 p-[10px] rounded-md ' onClick={HandleViewAllBugs}>View Reported Bugs</button>
                <button className='bg-amber-300 p-[10px] rounded-md ' onClick={HandleReportBug}>Report Bug</button>
                <button className='bg-amber-300 p-[10px] rounded-md ' onClick={handleClear}>Clear View</button>
            </div>
            <form onSubmit={handleSubmit} className={clsx(reportBug ? "" : "hidden", "max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md")}>
                <div>
                    <label htmlFor="bugName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Bug Name
                    </label>
                    <input
                        type="text"
                        id="bugName"
                        name="bugName"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bug_level" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Bug Level
                    </label>
                    <select
                        id="bugLevel"
                        name="bugLevel"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select level</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="risky">Risky</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="bug_description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Bug Description
                    </label>
                    <textarea
                        id="bugDescription"
                        name="bugDescription"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="bug_status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Bug Status
                    </label>
                    <select
                        id="bugStatus"
                        name="bugStatus"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select status</option>
                        <option value="report">Report</option>
                        <option value="solved">Solved</option>
                        <option value="inprogress">In Progress</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                >
                    Submit
                </button>
            </form>
            {
                successMsg && (
                    <div className="mt-4 w-[400px] py-[10px] rounded-md mx-auto bg-gradient-to-r from-green-400 to-blue-500 text-black dark:text-black text-center">
                        {successMsg}
                    </div>
                )
            }

            {
                displayBugData && bugData.length === 0  &&
                (
                    <p>User has not reported any bugs</p>
                )
            }
            {
                displayBugData && bugData.length != 0  &&
                (
                    (
                    <div>
                        <h1 className='text-center my-[10px] dark:text-white'>Displaying All Bugs</h1>
    
                           {bugData.data && bugData.data.map((bug, index)=>{
                                return (
                                    <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-md mb-4">
                                        <h2 className="text-lg font-semibold dark:text-white">{bug.bug_name}</h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Level: {bug.bug_level}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Description: {bug.bug_description}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">Status: {bug.bug_status}</p>
                                    </div>
                                )
                            })}
                    </div>
                    
                    
                )
                )
            }
            {
                reportedBugs && (
                    <div className="mt-4 w-[400px] py-[10px] rounded-md mx-auto bg-gradient-to-r from-red-400 to-blue-500 text-black dark:text-black text-center">
                        {reportedBugs}
                    </div>
                )
            }
        </section>
    );
}