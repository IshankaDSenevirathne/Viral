import dbConnect from'../../../lib/dbConnect';
import Order from "../../../schema/Order";

dbConnect();

export default async(req,res)=>{
    const {method} =req;
    console.log(method);
    switch(method){
        case 'GET':
            try{
                const ordersType = req.query.orders;
                const orders = await Order.find({orderStatus:ordersType});
                res.status(200).json({success:true,data:orders});
            }
            catch(error){
                res.status(400).json({sucess:false});
            }
            break;
        case 'PUT':
            try{
                const {orderStatus,id} = JSON.parse(req.body);
                console.log(id)
                const order= await Order.findByIdAndUpdate(id,{orderStatus},{
                    new:true,
                    runValidators:true
                });
                if(!order){
                    return res.status(400).json({success:false});
                }
                res.status(200).json({data:order,success:true}); 
            }catch(error){
                res.status(400).json({success:false});
            }
            break;
        case 'POST':
            console.log(req.body);
            try{
                const order = await Order.create(req.body);
                res.status(201).json({success:true,data:order})
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