const  express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const Bug = require("./models/bug.model");
const mongoose = require("mongoose")
require("dotenv").config();

// const coroptions = {
//     origin:"http://localhost:5173"
// };

const app = express();

app.use(express.urlencoded({extended:false}));
app.use(express.json());
// app.use(cors(coroptions));

const saltRound = 10;


app.get("/", (req, res)=>{
    return res.status(200).send("<h1>Welcome Back</h1>")
})
// working successfully: integrated successfully 
app.post("/bug", async (req,res)=>{
    const {bugname, buglevel,bugStatus, bugDescription, user_id} = req.body;
    try
    {
        if (!bugname || !buglevel || !bugDescription || !user_id)
        {
            return res.status(400).json({success:false, msg:"Invalid Input"})
        }
        console.log(`${buglevel}: ${bugname} : ${bugDescription}`);
        const new_bug = await Bug.create({bug_name:bugname, bug_level:buglevel, bug_description: bugDescription, bug_status:bugStatus, user_id:user_id })
        
        return res.status(200).json({success:true, msg:'Bug Created', data:new_bug})
    }
    catch(err)
    {
        console.log(`Error ${err}`)
        return res.status(400).json({success:true, msg:`Error ${err}`})
    }
})
// get all bugs: working successfully and integrated completed
app.get("/bugs", async (req,res)=>{
    try
    {
        const bugs = await Bug.find();
        return res.status(200).json({sucess:true, msg:"View All Bugs", data:bugs})
    }
    catch(err)
    {
        return res.status(500).json({success:true, msg:err});
    }
})
// search for bug based on bug_id: working successfully integration completed
app.get("/bug/:id", async (req,res)=>{
    const {id} = req.params;
    try //hatua.zetech.ac.ke
    {
        if (!id)
        {
            return res.status(200).json({success:false, msg:'No Id  given'})
        }
        const bug_found = await Bug.findById(id);
        console.log(`Bug found:`);
        console.log(bug_found);
        if (!bug_found)
        {
            return res.status(400).json({success:false, msg:`No product with id ${id}`});
        }

        return res.status(200).json({success:true, data:bug_found});
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:true, msg:err});

    }
})
// get bugs based on user_id: working successfully integration completed
app.get("/getUserId/:id", async (req, res)=>{
    const {id} = req.params;
    // console.log(`User ID: ${id}`);
    if (!id)
    {
            
        return res.status(400).json({success:false, msg:'Bad Request'})
    }
    // check if user exists
    const user = await User.findById(id);
    if (!user)
    {
        return res.status(400).json({success:false, msg:'No user with the given id'});
    }
    // console.log(`User found: ${user.email} with id: ${user._id}`);
    const bugs = await Bug.find({user_id: id});
    if (bugs.length === 0)
    {
        return res.status(200).json({success:false, msg:'No bugs found for the given user id'});
    }
    return res.status(200).json({success:true, msg:'Bugs fetched successfully', data:bugs});
})


// update bug based on bug_id : working and integrated successfully
app.put("/bug/:id", async (req, res)=>{
    const {id} = req.params;
    const {bugStatus, bugId} = req.body;
    console.log(`updatign bug with status ${bugStatus} and id: ${id}`);
    try
    {
        if (!id)
        {
            return res.status(400).json({success:false, msg:`No product with id: ${id}`})
        }
        const bug_updated = await Bug.findByIdAndUpdate({_id:id}, {bug_status:bugStatus});
        const updated_bug = await Bug.findOne({_id:id});
        return res.status(200).json({sucess:true, msg:"Bug Updated", data:updated_bug});
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:true, msg:`err`});
    }
})
// delete bug based on id and working successfully
app.delete("/bug/:id", async (req,res)=>{
    const {id} = req.params;
    console.log(`Deleting bug with id: ${id}`)
    try
    {
        if (!id)
        {
            return res.status(400).json({success:false, msg:`No product with id: ${id}`})
        }
        const result = await Bug.findByIdAndDelete(id);
        console.log(result);
        if (!result) // no id is found by method findByIdAndDelete() returns null
        {
            console.log(`No product with id: ${id}`);
            console.log(result);
            return res.status(400).json({success:false, msg:`No product with id : ${id}`})
        }
        return res.status(200).json({succes:true, msg:'Successfully deleted product'});
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:true, msg:err});
    }
})


// register user: working and integrated successfully
app.post("/register", async (req,res)=>{
    const {useremail, password} = req.body;
    const userEmail = useremail;
    const userPassword = password;
    try
    {
        console.log(`UserEmail: ${userEmail}`);
        const existingUser = await User.find({email:userEmail});
        console.log(existingUser.length)
        if(existingUser.lenght === 0) // if existingUser returns an array if length > 1 user does exist
        {
            return res.status(200).json({success:false, msg:"User exists"})
        }
        const passHash = await bcrypt.hash(userPassword, saltRound);
        const new_user = await User.create({email:userEmail, password:passHash})
        console.log(new_user)
        return res.status(201).json({success:true, msg:"Registration successfully"})
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:false, msg:err});
    }
})


// login user: working successfully and integrated successfully
app.post("/login", async (req,res)=>{
    const {useremail, password} = req.body;

    try
    {
        const foundUser = await User.findOne({email:useremail});
        if(foundUser)
        {
            console.log(`User found`);
            console.log(foundUser);
            console.log(foundUser.email)

            const result = await bcrypt.compare(password, foundUser.password);
            if (result)
            {
                const userObject = {user_id: foundUser._id}
                jwt.sign(userObject, process.env.JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
                    if (err) {
                        console.error("Error signing JWT:", err);
                        return res.status(500).json({success:false, msg:"Error signing JWT"});
                    }
                    return res.status(200).json({success:true, msg:"Login successfully", data:{useremail:foundUser.email, role:foundUser.role, user_id:foundUser._id, token:token}});
                });
            }
            else
            {
                return res.status(401).json({success:false, msg:'Invalid Credentials! Password Wrong'})
            }
        }
        else
        {
            return res.status(401).json({success:false, msg:'Invalid Credentials: No User with Email'})
        }
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:false, msg:`Error : ${err}`});
    }
})


// create admin : working and integrated successfully
app.post("/admin", async (req,res)=>{
    const {role, email, password} = req.body;
    console.log(` {req.body}: role: ${role} \n email: ${email} \n password: ${password}`);
    const useremail = email;
    const userPasswd = password;
    try
    {
        console.log(`role: ${role} \n useremail : ${useremail} \n userPasswd: ${userPasswd}`);
        if (!role || !useremail || !userPasswd)
        {
            console.log(`Received empty value`);
            return res.status(400).json({success:false, msg:"N"})
        }
        const existingAdmin =  User.find({email:useremail});// returns an array
        console.log(existingAdmin.length);
        if (existingAdmin.length === 0)
        {
            return res.status(200).json({success:false, msg:'Email already exists'});
        }

        const passHash = await bcrypt.hash(userPasswd, saltRound);

        const new_admin = await User.create({email:useremail, role:role, password:passHash} )
        return res.status(200).json({success:true, msg:"Admin created successfully", user_id:new_admin._id, user_email:new_admin.email});
    }
    catch(err)
    {
        console.log(`Error: ${err}`)
        return res.status(500).json({success:false, msg:`Error: ${err}`})
    }
})

//login admin: : working and integrated successfully
app.post("/logadmin", async (req, res)=>{
    const {role, useremail, password} = req.body;
    try
    {
        console.log(`Role :${role}, useremail:${useremail},password: ${password}`)
        if (!role || !useremail || !password)
        {
            console.log(`Received emptyvalue`);
            return res.status(400).json({success:false, sg:"N"})
        }
        const foundUser = await User.findOne({email:useremail});
        console.log(foundUser);
        if (foundUser)
        {
            if (foundUser.role === role)
            {

                const passHash = foundUser.password;
                const result = await bcrypt.compare(password, foundUser.password);
                if (result)
                {
                    return res.status(200).json({success:true, msg:"Admin Login successfully", data:{useremail:foundUser.useremail, role:foundUser.role, user_id:foundUser._id, user_email:foundUser.email}})
                }
                else
                {
                    return res.status(401).json({success:false, msg:'Invalid Credentials! Password Wrong'})
                }
            }
        }
    }
    catch(err)
    {
        console.log(`Error: ${err}`)
        return res.status(500).json({success:false, msg:`Error: ${err}`})
        
    }
})
// # ADMIN FUNCTIONALAITIES
// get all users : working and integrated successfully
app.get("/users", async (req, res)=>{
    try
    {
        const all_users = await User.find();
        if (all_users)
        {
           return res.status(200).json({success:true, data:all_users}) 
        }

    }
    catch(err)
    {
        console.log(`Error: ${err}`)
        return res.status(500).json({success:false, msg:`Error: ${err}`})
    }
})


const PORT = process.env.PORT_NUMBER;
console.log(PORT)
const user = process.env.MONGO_USR;
const password = process.env.MONGO_PASSWD;

// mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.f2dd9sx.mongodb.net/BugDB?retryWrites=true&w=majority&appName=Cluster0`)
// .then(()=>{
//         app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}: http://localhost:${PORT}`)})
//         console.log("Connected to MongoDB");
//     })
//     .catch(err=>{
//         console.log(`Error: ${err}`);
//     })

module.exports = app;