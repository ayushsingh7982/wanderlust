const express=require("express");
const app=express();

app.get("/getcookies",(req,res)=>{
    res.cookie("Greet","Hello");

    res.send("sent you some cookies");
});

app.get("/",(req,res)=>{
    req.setEncoding("Hi, I am root!");
})

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})

