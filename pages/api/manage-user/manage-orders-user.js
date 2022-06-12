import dbConnect from'../../../lib/dbConnect';
import Order from "../../../schema/Order";
import Product from "../../../schema/Product";


dbConnect();

export default async(req,res)=>{
    const {method} =req;
    console.log(method);
    switch(method){
        case 'GET':
            try{
                const userEmail = req.query.user;
                const orders = await Order.find({emailAddress:userEmail});
                let transformedOrders=[];
                for(const order of orders){
                    let transformedProducts=[];
                    for(const product of order.orderDetails.products){
                        const {images}=await Product.findOne({name:product.productName})
                        transformedProducts.push({
                            productName:product.productName,
                            productSize:product.productSize,
                            productColor:product.productColor,
                            productQuantity:product.productQuantity,
                            productPrice:product.productPrice,
                            productImage:images[0],
                            productId:product._id,
                            reviewDetails:product.reviewDetails
                            })
                    }
                    transformedOrders.push({
                        clientName:order.clientName,
                        orderId:order._id,
                        address:order.homeAddress,
                        paymentStatus:order.paymentStatus,
                        createdAt:order.createdAt,
                        orderDetails:{
                            totalPrice:order.orderDetails.totalPrice,
                            products:transformedProducts
                        },
                        orderStatus:order.orderStatus
                    })
                }
                res.status(200).json({success:true,data:transformedOrders});
            }
            catch(error){
                res.status(400).json({sucess:false});
                console.log(error)
            }
            break;
        default:
            res.status(400).json({success:false});
            break;
    }
}