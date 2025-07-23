const  express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/user.model");
const Bug = require("./models/bug.model");
const mongoose = require("mongoose")
require("dotenv").config();

const coroptions = {
    origin:"http://localhost:5173"
};

const app = express();

app.use(cors(coroptions));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

const saltRound = 10;


app.get("/", (req, res)=>{
    return res.send("<h1>Welcome Back</h1>")
})
// working successfully
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
// search for bug based on bug_id
app.get("/bug/:id", async (req,res)=>{
    const {id} = req.params;
    try
    {
        if (!id)
        {
            return res.status(200).json({success:false, msg:'No Id  given'})
        }
        const bug_found = await Bug.fingById(id);
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
// get bugs based on user_id
app.get("/getUserId/:id", async (req, res)=>{
    if (!id)
    {
            
        return res.status(400).json({success:false, msg:'Bad Request'})
    }
    const bugs = await Bug.find({user_id: id});
    if (bugs.length === 0)
    {
        return res.status(200).json({success:false, msg:'No user with the given id'});
    }

})


// update bug based on bug_id
app.put("/bug/:id", async (req, res)=>{
    const {id} = req.params;
    const {bugLevel} = req.body;
    try
    {
        if (!id)
        {
            return res.status(400).json({success:false, msg:`No product with id: ${id}`})
        }
        const bug_updated = await Bug.findByIdAndUpdate({_id:id}, {bug_level:bugLevel});
        const updated_bug = await Bug.findOne({_id:id});
        return res.status(200).json({sucess:true, msg:"Bug Updated", data:updated_bug});
    }
    catch(err)
    {
        console.log(`Error: ${err}`);
        return res.status(500).json({success:true, msg:`err`});
    }
})
// delete bug based on id
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


// register user
app.post("/register", async (req,res)=>{
    const {userEmail, userPassword} = req.body;
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


// login user
app.post("/login", async (req,res)=>{
    const {useremail, password} = req.body;
    try
    {
        const foundUser = await User.findOne({email:useremail});
        if(foundUser)
        {
            
            const result = await bcrypt.compare(password, foundUser.password);
            if (result)
            {
                return res.status(201).json({success:true, msg:"Login successfully", data:{useremail:foundUser.useremail, role:foundUser.role, user_id:foundUser._id}})
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


// create admin
app.post("/admin", async (req,res)=>{
    const {role, useremail, userPasswd} = req.body;

    try
    {
        console.log(`role: ${role} \n useremail : ${useremail} \n userPasswd: ${userPasswd}`)
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

//login admin
app.post("/logadmin", async (req, res)=>{
    const {role, useremail, password} = req.body;
    try
    {
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
                    return res.status(201).json({success:true, msg:"Admin Login successfully", data:{useremail:foundUser.useremail, role:foundUser.role, user_id:foundUser._id, user_email:foundUser.email}})
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
// get all users
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
app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}: http://localhost:${PORT}`)})
const user = process.env.MONGO_USR;
const password = process.env.MONGO_PASSWD;

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.f2dd9sx.mongodb.net/BugDB?retryWrites=true&w=majority&appName=Cluster0`)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch(err=>{
        console.log(`Error: ${err}`);
    })