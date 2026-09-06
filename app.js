import express from 'express';
const app=express();

const port=5000;
app.get('/',(req,res)=>{
    res.send('Hello Everyone 😍')
})
app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})