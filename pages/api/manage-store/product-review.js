import dbConnect from '../../../lib/dbConnect';
import Product from "../../../schema/Product";
import Order from "../../../schema/Order";
import { ObjectId } from 'mongodb';

dbConnect();

export default async(req,res)=>{
    const {method} = req
    switch(method){
        case "GET":
            const data =await Product.find().sort({"ratingDetails.rating":-1}).limit(6);
            return res.status(200).json({success:true,data})
        case "PUT":
            const {productId,productName,orderId,userName,rating,review} = JSON.parse(req.body);
            const product = await Product.find({name:productName});
            const newProduct={
                ...product,ratingDetails:{
                    rating:product.rating?product.rating+rating:rating,
                    reviewCount:product.reviewCount?product.reviewCount+1:1,
                    userReviews:product.userReviews?product.userReviews.push({user:userName,review}):[{user:userName,review}]
                }
            }
            const order = await Order.updateOne({_id:orderId},
                { $set: { "orderDetails.products.$[product].reviewDetails.review":review,"orderDetails.products.$[product].reviewDetails.rating":rating } },
                { arrayFilters: [
                  { "product._id":ObjectId(productId)}
                  ]
                }
            )
            const result = await Product.updateOne({name:productName},newProduct,{
                new:true,
                runValidators:true
            })
            console.log(result)

        default:
            res.status(400).json({success:false});
            break;
    }
}
