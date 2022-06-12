import dbConnect from '../../../lib/dbConnect';
import Product from "../../../schema/Product";

dbConnect();

export default async(req,res)=>{
    const {method} = req
    switch(method){
        case "GET":
            const data =await Product.find().sort({_id:-1}).limit(10);
            return res.status(201).json({success:true,data})
        default:
            res.status(400).json({success:false});
            break;
    }
}
