import dbConnect from'../../../lib/dbConnect';
import Basket from "../../../schema/Basket";
dbConnect();

export default async(req,res)=>{
    const {method} =req;
    console.log(method);
    switch(method){
        case 'GET':
            try{
                const emailAddress = req.query.user;
                const savedOrders = await Basket.find({emailAddress});
                res.status(200).json({success:true,data:savedOrders});
            }
            catch(error){
                res.status(400).json({sucess:false});
            }
            break;
        case 'POST':
            try{
                const order = req.body;
                const savedOrder = await Basket.create(order);
                res.status(201).json({success:true,data:savedOrder})
            }catch(error){
                res.status(400).json({success:false});
                console.log(error);
            }
            break;
        case 'DELETE':
            try{
                const {orderId}= JSON.parse(req.body)
                // console.log(orderId)
                const deletedOrder = await Basket.findByIdAndDelete({_id:orderId});
                res.status(201).json({success:true,message:"order deleted successfully"})
            }catch(error){
                res.status(400).json({success:false});
                console.log(error);
            }
        default:
            res.status(400).json({success:false});
            break;
    }
}