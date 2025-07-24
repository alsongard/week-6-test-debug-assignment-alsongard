import React, { useState , useEffect} from 'react';
import axios from 'axios';
import { set } from 'mongoose';
function AdminPage() {
    const [selectedAction, setSelectedAction] = useState('');
    const [bugData, setBugData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [displayUpdateForm, setDisplayUpdateForm] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        bugId: '',
        bugStatus: ''
    });
    const [deleteFormView, setDeleteFormView] = useState(false);
    const [formDataId, setFormDataId] = useState({
        id: ""
    });
    const [getUserId, setGetUserId] = useState({
        id: ""
    });
    const [userBugView, setUserBugView] = useState(false);

    async function handleAction(action) {
        setSelectedAction(action);
        try {

            if (action === 'getAllBugs') {
                // Fetch all bugs logic
                const res = await axios.get("http://localhost:5001/bugs");
                console.log(res.data.data);
                setBugData(res.data.data);
            }
            else if (action === 'getAllUsers') {
                // Fetch all users logic
                const res = await axios.get("http://localhost:5001/users");
                console.log(res.data.data);
                setUserData(res.data.data);
            }
            else if (action === 'updateBug') {
                // Logic to update a bug
                setDisplayUpdateForm(true);
                // const res = await axios.put("http://localhost:5001/bug/:id")
                
            }
            else if (action === 'deleteBug') {
                // Logic to delete a bug
                setDeleteFormView(true);
                
            }
            else if (action === 'viewBugByUserId') {
                setUserBugView(true);
                // const res = await axios.get("http://localhost:5001/getUserId/ ")
                // setBugData(res.data.data)
            }
            else if (action === 'clear') {
                // Logic to clear the selected action
                setSelectedAction('');
                setBugData([]);
                setDisplayUpdateForm(false);
                setIsTouched({});
                setUpdateFormData({
                    bugId: '',
                    bugStatus: ''
                })
                setDeleteFormView(false);
                setFormDataId({ id: "" });
                setAdminView(false);
                setUserBugView(false);
                setGetUserId({ id: "" });
                setUpdateSuccessMsg("");
            }

            else if (action === "addAdmin")
            {
                setAdminView(true)
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const [isTouched, setIsTouched] = useState({});
    function hanldeBlur(event) {
        const { name,  } = event.target;
        setIsTouched(prevState => ({
            ...prevState,
            [name]: true
        }));
    }
    const [updateBugInfo, setUpdateBugInfo] = useState({});
    async function getBugData(id)
    {
        console.log(`Bug ID: ${id}`);
        try {
            const res = await axios.get(`http://localhost:5001/bug/${id}`);
            console.log("Getting Bug Data before Update")
            console.log(res.data.data);
            setUpdateBugInfo(res.data.data);
        } catch (error) {
            console.error("Error fetching bug data:", error);
        }
    }
    const displayUpdateBugId = isTouched.bugId && updateFormData.bugId.trim() ? true : false;
    useEffect(() => {
        if (displayUpdateBugId) {
            getBugData(updateFormData.bugId);
        }
    }, [updateFormData.bugId]);
    
    // You can add logic here to fetch data or show forms based on action
    function handleChange(event) {
        const { name, value } = event.target;
        setUpdateFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    const [updateSuccessMsg, setUpdateSuccessMsg] = useState("")
    async function handleSubmit(event) {
        event.preventDefault();
        const { bugId, bugStatus } = updateFormData;
        try {
            const res = await axios.put(`http://localhost:5001/bug/${bugId}`, { bugStatus });
            // console.log("Bug updated successfully:", res.data);
            console.log(res.data);
            console.log(`success: ${res.data.sucess}`);
            console.log(`msg: ${res.data.msg}`);
            if (res.data.sucess)
            {
                console.log(`Runnning sucess`);
                setUpdateSuccessMsg(`Bug with ${bugId} successfully updated`);
                setTimeout(()=>{
                    setUpdateSuccessMsg("");

                }, 10000)
            }
        } catch (error) {
            console.error("Error updating bug:", error);
        }
    }
    function handleDeleteChange(event)
    {
        const { name, value} = event.target;
        console.log(`name: ${name} and value: ${value}`);
        setFormDataId(() => {
            return { id: value };
        });
    }

    async function handleDeleteSubmit(event)
    {
        event.preventDefault();
        console.log(formDataId);
        try
        {
            const { id } = formDataId;
            console.log(`Bug ID to delete: ${id}`);
            const res = await axios.delete(`http://localhost:5001/bug/${id}`);
            console.log("Bug deleted successfully:", res.data);
            if (res.data.success)
            {
                console.log(`Running delete sucess`);
                
                setUpdateSuccessMsg(`Bug with ID ${id} successfully deleted`);
                // setTimeout(()=>{
                //     setUpdateSuccessMsg("");
                // }, 10000);
            }
        }
        catch (error)
        {
            console.error("Error deleting bug:", error);
        }

    }

    // add admin
    const [adminView, setAdminView] = useState(false);
    const [formAdmin, setFormAdmin] = useState({
        email: "", 
        password: "",
        role: "admin"
    })

    function handleAdminChange(event)
    {
        const {name, value} = event.target;
        setFormAdmin((prevData)=>{
            return {
                ...prevData,
                [name]: value
            }
        })
    }
    async function handleAdminSubmit(event)
    {
        event.preventDefault();
        console.log(formAdmin)
        try
        {
            const res = await axios.post("http://localhost:5001/admin", formAdmin);
            if (res.data.success)
            {
                setUpdateSuccessMsg("Admin created successfully")
                setInterval(()=>{
                    setUpdateSuccessMsg("");
                }, 10000);
            }
        }
        catch(err)
        {
            console.log(`Error ${err}`);
        }
    }
    function handleGetUserChange(event){
        const {name, value} = event.target;
        setGetUserId((prevData)=>{
            return {
                ...prevData,
                [name]: value
            }
        });
    };
    async function handleGetUserBugs(event){
        event.preventDefault();
        console.log(getUserId);
        try {
            const res = await axios.get(`http://localhost:5001/getUserId/${getUserId.id}`);
            console.log("Bugs for user ID:", res.data.data);
            setBugData(res.data.data);
            
        } catch (error) {
            console.error("Error fetching user bugs:", error);
        }
    }
    return (
        <div className="relative min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="absolute left-0 top-0 w-[300px]  bg-gray-800 text-white flex flex-col p-8 overflow-y-auto h-full">
                <h2 className="mb-8 text-2xl font-semibold">Admin Panel</h2>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('getAllBugs')}
                >
                    Get All Bugs
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('getAllUsers')}
                >
                    Get All Users
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('updateBug')}
                >
                    Update Bug
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('deleteBug')}
                >
                    Delete Bug
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('viewBugByUserId')}
                >
                    View Bug by User ID
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('addAdmin')}
                >
                    Add Admin
                </button>
                <button
                    className="bg-gray-700 text-white border-none py-3 px-4 mb-4 rounded cursor-pointer text-base text-left hover:bg-gray-600"
                    onClick={() => handleAction('clear')}
                >
                    Clear
                </button>
            </aside>

            {/* Main Content */}
            <main className="ml-75 h-[1000px] overflow-y-auto">
                <h1 className="text-3xl pl-[10px]  py-[10px] font-bold">Welcome to the Admin Page</h1>
                {selectedAction && (
                    <div className="bg-amber-300 pl-[10px] py-[5px] ">
                        <h3 className="text-xl font-medium">Selected Action: {selectedAction}</h3>
                        {/* Render forms or data based on selectedAction */}
                    </div>
                )}
                <div className='bg-slate-600 flex flex-col gap-y-[20px] py-[50px] px-[20px] '>
                    {
                        selectedAction ===  "" &&
                        (
                            <p className='text-lg text-center text-white'>Please select an action from the sidebar.</p>
                        )
                    }
                    {
                        userBugView && 
                        (
                            <form onSubmit={handleGetUserBugs} className=' dark:bg-slate-900 flex flex-col gap-y-[10px] rounded-md py-[20px] px-[20px]'>
                                <label className='text-white'>User ID:</label>
                                <input value={getUserId.id} onChange={handleGetUserChange} name='id'type="text" className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md' placeholder='Enter User ID' />
                                <input type="submit" value="Get Bugs" className='bg-blue-500 text-white py-[10px] rounded-md cursor-pointer hover:bg-blue-600' />
                            </form>
                        )
                    }
                    {
                        selectedAction === "getAllBugs"  &&
                        (
                            bugData.map((dataItem, index) => {
                                return (
                                    <div className='py-[20px] pl-[20px] bg-slate-800 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] rounded-md' key={dataItem._id}>
                                        <p className='text-black dark:text-white'>_id: {dataItem._id}</p>
                                        <p className='text-black dark:text-white'>Bug Name: {dataItem.bug_name}</p>
                                        <p className='text-black dark:text-white'>Bug Level: {dataItem.bug_level}</p>
                                        <p className='text-black dark:text-white'>Bug Description: {dataItem.bug_description}</p>
                                        <p className='text-black dark:text-white'>Bug Status: {dataItem.bug_status}</p>
                                        <p className='text-black dark:text-white'>Bug Created At: {dataItem.createdAt}</p>
                                        <p className='text-black dark:text-white'>Bug Updated At: {dataItem.updatedAt}</p>
                                        <p className='text-black dark:text-white'>User ID: {dataItem.user_id}</p>                                </div>
                                )
                            })
                        )
                    }
                    {
                        selectedAction === "getAllUsers" &&
                        (
                            userData.map((userItem, index) => {
                                return (
                                    <div className='py-[20px] pl-[20px] bg-slate-800 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] rounded-md' key={userItem._id}>
                                        <p className='text-black dark:text-white'>_id: {userItem._id}</p>
                                        <p className='text-black dark:text-white'>Email: {userItem.email}</p>
                                        <p className=' text-black dark:text-white'>Role: {userItem.role}</p>
                                        <p className='text-black dark:text-white'>Created At: {userItem.createdAt}</p>
                                        <p className='text-black dark:text-white'>Updated At: {userItem.updatedAt}</p>
                                    </div>
                                )
                            })
                        )
                    }
                    {
                        displayUpdateForm &&
                        (
                            <div>
                                <h2 className='text-lg text-white mb-[10px]'>Update Bug Status</h2>
                                <form onSubmit={handleSubmit} className=' dark:bg-slate-900 flex flex-col gap-y-[10px] rounded-md py-[20px] px-[20px]'>
                                    <label className='text-white'>Bug ID:</label>
                                    <input onBlur={hanldeBlur} value={updateFormData.bugId} onChange={handleChange} name='bugId'type="text" className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md' placeholder='Enter Bug ID' />
                                    <select name="bugStatus" value={updateFormData.bugStatus} onChange={handleChange} className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md'>
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <input type="submit" value="Update Bug" className='bg-blue-500 text-white py-[10px] rounded-md cursor-pointer hover:bg-blue-600' />
                                </form>
                            </div>


                        )
                    }
                    {
                        isTouched.bugId && updateFormData.bugId.trim() &&
                        (
                            <div key={updateBugInfo._id} className='py-[20px] pl-[20px] bg-slate-800 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] rounded-md'  >
                                <p className='text-black dark:text-white'>Bug ID: {updateBugInfo._id}</p>
                                <p className='text-black dark:text-white'>Bug Name: {updateBugInfo.bug_name}</p>
                                <p className='text-black dark:text-white'>Bug Level: {updateBugInfo.bug_level}</p>
                                <p className='text-black dark:text-white'>Bug Description: {updateBugInfo.bug_description}</p>
                                <p className='text-black dark:text-white'>Bug Status: {updateBugInfo.bug_status}</p>
                            </div>
                        )
                    }
                    {/* selectedAction === "viewBugByUserId" */}
                    {
                        selectedAction === "viewBugByUserId" &&
                        (
                            bugData.map((dataItem, index) => {
                                return (
                                    <div className='py-[20px] pl-[20px] bg-slate-800 shadow-[0px_0px_10px_rgba(0,0,0,0.5)] rounded-md' key={dataItem._id}>
                                        <p className='text-black dark:text-white'>_id: {dataItem._id}</p>
                                        <p className='text-black dark:text-white'>Bug Name: {dataItem.bug_name}</p>
                                        <p className='text-black dark:text-white'>Bug Level: {dataItem.bug_level}</p>
                                        <p className='text-black dark:text-white'>Bug Description: {dataItem.bug_description}</p>
                                        <p className='text-black dark:text-white'>Bug Status: {dataItem.bug_status}</p>
                                        <p className='text-black dark:text-white'>Bug Created At: {dataItem.createdAt}</p>
                                        <p className='text-black dark:text-white'>Bug Updated At: {dataItem.updatedAt}</p>
                                        <p className='text-black dark:text-white'>User ID: {dataItem.user_id}</p>                                </div>
                                )
                            })
                        )
                    }
                    {
                        updateSuccessMsg && <p className='dark:text-white bg-gradient-to-r from-blue-500 to-sky-400 py-[5px] pl-[5px] rounded-md' >{updateSuccessMsg} </p>
                    }

                    {
                        deleteFormView && (
                            <div>
                                <h2 className='text-lg text-white mb-[10px]'>Delete Bug</h2>
                                <form onSubmit={handleDeleteSubmit} className=' dark:bg-slate-900 flex flex-col gap-y-[10px] rounded-md py-[20px] px-[20px]'>
                                    <label className='text-white'>Bug ID:</label>
                                    <input value={formDataId.id} onChange={handleDeleteChange} name='id'type="text" className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md' placeholder='Enter Bug ID' />
                                    <input type="submit" value="Delete Bug" className='bg-blue-500 text-white py-[10px] rounded-md cursor-pointer hover:bg-blue-600' />
                                </form>
                            </div>
                        )
                    }
                    {
                        adminView &&
                        (
                            <div>
                                <h2 className='text-lg text-white mb-[10px]'>Add Admin</h2>
                                <form onSubmit={handleAdminSubmit} className=' dark:bg-slate-900 flex flex-col gap-y-[10px] rounded-md py-[20px] px-[20px]'>
                                    <input value={formAdmin.email} onChange={handleAdminChange} name='email'type="text" className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md' placeholder='Admin Email..' />
                                    <input value={formAdmin.password} onChange={handleAdminChange} name='password' type="password" className='w-full p-[10px] mb-[10px] border-2 bg-white border-white rounded-md' placeholder='Admin Password..' />
                                    <input type="submit" value="Create Admin" className='bg-blue-500 text-white py-[10px] rounded-md cursor-pointer hover:bg-blue-600' />
                                </form>
                            </div>
                        )
                    }
                    
                </div>


            </main>
        </div>
    );
};

const buttonStyle = {
    background: '#353b48',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'left',
};

export default AdminPage;