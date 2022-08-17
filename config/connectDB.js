import mongoose from "mongoose";

const connectDB=async(url)=>{
    try{
        const DB_OPTIONS = {
            dbName:"my-db"
        }
       await mongoose.connect(url, DB_OPTIONS)
       console.log("DB CONECTED ....");
    }catch(err){
        console.log("not vonnected");   
    }
            
}


export default connectDB;