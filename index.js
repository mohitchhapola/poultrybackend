const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes") 
const empRoute = require("./routes/empRoute") 
const dailyRoute = require("./routes/dailyRoute") 
const productRoute = require("./routes/productRoute") 
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser")
const app =  express()
const cors = require("cors")

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(
  cors({
    origin: '*',//"http://localhost:3000","192.168.18.93:3000"
    methods: ["POST", "GET","DELETE","PATCH"],
    allowedHeaders:'*',
    // methods: [userRoute.allMethods],
    credentials: true,
  })
);

// routes middlerware
app.use("/api/users",userRoute)
app.use("/api/product",productRoute)
app.use("/api/emp",empRoute)
app.use("/api/dailyAct",dailyRoute)



//routes                                                  
app.get("/",(req,res)=>{
  res.send("Home Page")
})

//error middleware
app.use(errorHandler)
// "mongodb+srv://mohitchh_:mohit07@cluster0.3mpjocd.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
//connect to mongodb and start server
const port =5000;
mongoose
    .connect("mongodb+srv://mohitchh_:mohit07@cluster0.3mpjocd.mongodb.net/?retryWrites=true&w=majority&appName=cluster0")
    .then(()=>{
      app.listen(port,()=>{
        console.log(`Server is running on ${port}`);
      })
      console.log("connected to database")
    })
    .catch((err)=>console.log(err))





// const http = require('http');

// const hostname = '127.0.0.1';

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
