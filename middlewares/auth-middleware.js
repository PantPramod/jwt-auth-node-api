import jwt from 'jsonwebtoken';

import userModel from '../models/User.js';


const checkUserAuth=async(req, res, next)=>{

    let token;

    const {authorization} =  req.headers;

    if(authorization && authorization.startsWith('Bearer')){
        try{
          token =  authorization.split(' ')[1]  

          const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

          req.user = await userModel.findById(userID).select('-password');
          next();
        }catch(err){
            res.status(401).send({ "status": "failed", "message": errpr.message })
       
        }
    }
    if(!token){
        res.status(401).send({ "status": "failed", "message": "Unauthorized user no token" })
    }
}


export default checkUserAuth;