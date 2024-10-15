//using express
const express = require('express');
const mongoose=require('mongoose');
const  cors=require('cors');

//creat an express
const app=express();
app.use(express.json())
app.use(cors())

//smaple inmemory
//let todos=[];

//connecting mongoDB 
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
 console.log('DB Connected')
})
.catch((err)=>{
 console.log('DB is not connected')   
})
//creating shema
const todoSchema=new mongoose.Schema({
    title: {
            required:true,
            type: String
    },
    description: String
})

//creating model
const todoModel=mongoose.model('Todo',todoSchema);


//creat todo item
app.post('/todos',async (req,res) => {
     const {title,description}=req.body;
     //const newTODO={
       // id: todos.length+1,
        //title,
        //description
     //};
     //console.log(todos);
     //todos.push(newTODO);
    try{
     const newTodo=new todoModel({title,description});
     await newTodo.save();
     res.status(201).json(newTodo);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message});

    }  
})

//get all item
app.get('/todos', async(req,res)=>{
    try {
        const todos=  await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

//update todo item
app.put("/todos/:id",async(req,res)=>{
    try {
        const{title, description}=req.body;
    const id=req.params.id;
    const updatedTODO=await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
    if(!updatedTODO){
        res.status(404).json({message:"TODO not found"});
    }
    res.json(updatedTODO)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

//delet the item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   

})
//start the server
const port=8000;
app.listen(port,()=>{
    console.log("Server listening to port" +port)
})    