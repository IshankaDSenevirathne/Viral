import dbConnect from '../../../lib/dbConnect';
import Product from "../../../schema/Product";
import { v2 as cloudinary } from 'cloudinary';

dbConnect();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY,
    secure: true
  });

export default async(req,res)=>{
    const {method} = req;
    switch(method){
        case 'GET':
            try{
                const {category} = req.query;
                const products = await Product.find({category});
                res.status(200).json({success:true,data:products});

            }catch(error){
                res.status(400).json({success:false});
            }
            break;
        case 'PUT':
            try{
                const {id,name,company,category,genders,ages,features,price,colors,sizes,images} = JSON.parse(req.body);
                const newData = {name,company,category,genders,ages,features,price,colors,sizes,images};
                const productData= await Product.find({_id:id});
                if(images){
                    for(const image of productData[0].images){
                        cloudinary.uploader.destroy(image.publicID, function(error,result) {
                            console.log(result, error) });
                    }
                }
                const product= await Product.findByIdAndUpdate(id,newData,{
                    new:true,
                    runValidators:true
                });
                if(!product){
                    return res.status(400).json({success:false});
                }
                res.status(200).json({data:product,success:true}); 
            }catch(error){
                res.status(400).json({success:false});
            }
            break;
        case 'POST':
            try{
                const product = await Product.create(req.body);
                res.status(201).json({success:true,data:product})
            }catch(error){
                res.status(400).json({success:false});
                console.log(error);
            }
            break;
        case 'DELETE':
            try{
                const {id}= JSON.parse(req.body);
                const productData = await Product.find({_id:id});
                for(const image of productData[0].images){
                    cloudinary.uploader.destroy(image.publicID,function(error,result){
                        console.log(result,error)
                    })
                }
                const deletedProduct= await Product.deleteOne({_id:id});
                if(!deletedProduct){
                    return res.status(400).json({success:false});
                }
                res.status(200).json({success:true,data:{}}); 
            }catch(error){
                res.status(400).json({success:false});
            }
            break;
        default:
            res.status(400).json({success:false});
            break;
            
    }
}