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
    origin: ['http://localhost:3000','https://newagro.vercel.app'], // Allow your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    allowedHeaders:['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers)
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

//connect to mongodb and start server
const port =5000;
mongoose
    .connect(process.env.DB_URL)
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
