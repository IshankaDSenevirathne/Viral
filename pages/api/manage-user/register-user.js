import dbConnect from'../../../lib/dbConnect';
import User from "../../../schema/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dbConnect();

export default async(req,res)=>{
    const {method} =req;
    console.log(method);
    switch(method){
        case 'POST':
            try{
                const {firstName,lastName,email,password} = req.body;
                console.log(req.body);
                const user = await User.findOne({email});
                if(user){
                    res.status(422).json({message:"Email already in use"})
                }
                const hashedPassword = await bcrypt.hash(password,12)
                const newUser = await User.create({
                    firstName,lastName,email,password:hashedPassword
                });
                const token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{
                    expiresIn:"300s",
                });
                const {_id} = newUser;
                res.status(201).json({success:true,user:{email,_id,firstName,lastName},token})
            }catch(error){
                res.status(400).json({success:false});
                console.log(error);
            }
            break;
        default:
            res.status(400).json({success:false});
            break;
    }
}