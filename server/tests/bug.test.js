require('dotenv').config();
const request = require('supertest');
const app = require("../server");
const mongoose = require("mongoose");
const PORT = process.env.PORT_NUMBER;
console.log(PORT);
const user = process.env.MONGO_USR;
const password = process.env.MONGO_PASSWD;


beforeAll(async () => {
  await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.f2dd9sx.mongodb.net/BugDB?retryWrites=true&w=majority&appName=Cluster0`);
});



request(app);

// working successfully
describe("Home Page", ()=>{
    it("Should just display home", async ()=>{
        const res =  await request(app)
            .get("/")
            // console.log(res.text)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual("<h1>Welcome Back</h1>")
    },5000)
})


// working successfully
describe("Get All Bugs", ()=>{
    it('should get all bugs:', async ()=>{
        const res = await request(app)
            .get("/bugs")
            // console.log(res.body.sucess)
        expect(res.statusCode).toEqual(200);
        expect(res.body.sucess).toEqual(true);
    }, 10000)
}) 

// create bug
describe("Create Bug", ()=>{
    it("Create a Bug Report:", async ()=>{
        const res = await request(app)
            .post("/bug")
            .send({bugname: "While loop ", buglevel: "high", bugDescription: "While loops runs infinity", user_id: "68824caefe7be6dc66a10aeb"})
        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true)
    })
})

// getBug based on bug_id
describe("Get Bug based on Bug_id", ()=>{
    it("Return Bug based on bug_id ", async ()=>{
        const res = await request(app)
            .get("/bug/68824c29fe7be6dc66a10ade")

        // console.log(res)
        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true)
        expect(res.body.data).toHaveProperty('_id')
    })
})

// getBug based on User_id
describe("Get Bug Based on User_id", ()=>{
    it("Return bugs based on user_id", async ()=>{
        const res = await request(app)
            .get("/getUserId/68824c12fe7be6dc66a10adb")

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true)
        expect(res.body).toHaveProperty("data")
    })
})

// updateBug
describe("Update Bug", ()=>{
    it("Updated a bug status using bug_id", async ()=>{
        const res = await request(app)
            .put("/bug/68824c29fe7be6dc66a10ade")
            .send({bugStatus: "solved", bugId: "68824d16fe7be6dc66a10af2"})
        console.log(res)
        expect(res.statusCode).toEqual(200)
        expect(res.body.data).toHaveProperty("_id")
    })
})

// delete bug
describe("Delete Bug", ()=>{
    it("Delete a bug based on bug_id", async()=>{
        const res = await request(app)
            .delete("/bug/6882502bd8b8e5772a88010f")

        console.log(res.body)
        expect(res.statusCode).toEqual(200)
        expect(res.body.succes).toEqual(true)
        expect(res.body).toHaveProperty("succes")
    })
})

// create user
describe("Create User", ()=>{
    it("Register User", async ()=>{
        const res = await request(app)
            .post("/register")
            .send({useremail:"priyanka@gmail.com", password:'Wk7,k"4TC2^9K*%'})
            
        console.log(res)  
        console.log(res.body)
        expect(res.statusCode).toEqual(201)

    })
})

// login user
describe("Login User", ()=>{
    it("Logins Post ", async ()=>{
        const res = await request(app)
            .post("/login")
            .send({useremail:"mkadinali@gmail.com", password:'Wk7,k"4TC2^9K*%'})
        
        console.log(res);
        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true)
        expect(res.body).toHaveProperty("data")
    })
})

// create admin
describe("Create Admin", ()=>{
    it("Registers an Admin", async ()=>{
        const res = await request(app)
            .post("/admin")
            .send({role: "admin", email:"strumbell@gmail.com", password: "yuan@123"})

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true)
    })
})

// loginadmin
describe("Login Admin", ()=>{
    it("Logs in an Admin User", async ()=>{
        const res = await request(app)
            .post("/logadmin")
            .send({role:"admin", useremail:"yuan@gmail.com", password: "yuan@123"})

        console.log(res)
        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toEqual(true);
    })
})

// getAllusers
describe("Get Users", ()=>{
    it("Views all Users", async ()=>{
        const res = await request(app)
            .get("/users")
        
        expect(res.statusCode).toEqual(200)
        expect(res.body.success).true
    })
})