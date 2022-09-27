import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    phoneno:{
        type:String,
        required:true,
        trim:true
    },
     company:{
        type:String,
        required:true,
        trim:true
    },
})

const employeeModel =  mongoose.model('employee', employeeSchema);

export default employeeModel;