import dbConnect from'../../../lib/dbConnect';
import User from "../../../schema/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

dbConnect();

export default async(req,res)=>{
    const {method} =req;
    switch(method){
        case 'GET':
            try{
                // const ordersType = req.query.orders;
                const user = req.query.userEmail;
                const orders = await Order.find({emailAddress:userEmail});
                res.status(200).json({success:true,data:orders});
            }
            catch(error){
                res.status(400).json({sucess:false});
            }
            break;
        case 'POST':
            try{
                const {email,password} = req.body;
                const user = await User.findOne({email});
                if(!user){
                    res.status(422).json({message:"User does not exist"})
                }
                const doMatch = await bcrypt.compare(password,user.password);
                if(!doMatch){
                    res.status(404).json({message:"icorrecct credentials"})
                }else{
                    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
                        expiresIn:"300s",
                    })
                    const {email,_id,firstName,lastName} = user
                    res.status(200).json({message:"login success",user:{email,_id,firstName,lastName},token})
                }
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