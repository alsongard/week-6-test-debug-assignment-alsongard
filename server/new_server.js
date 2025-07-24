const mongoose = require("mongoose");
const cors = require("cors");
const coroptions = {
    origin:"http://localhost:5173"
};
const app = require("./server")

app.use(cors(coroptions));

const PORT = process.env.PORT_NUMBER;
console.log(PORT)
const user = process.env.MONGO_USR;
const password = process.env.MONGO_PASSWD;

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.f2dd9sx.mongodb.net/BugDB?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
        app.listen(PORT, ()=>{console.log(`Listening on port ${PORT}: http://localhost:${PORT}`)})
        console.log("Connected to MongoDB");
    })
    .catch(err=>{
        console.log(`Error: ${err}`);
    })