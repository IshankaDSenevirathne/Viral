import mongoose from 'mongoose';

const connection = {};

async function dbConnect(){
    if(connection.isConnected){
        return;
    }
    
    const db= await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected ? "Database connection successfully established!":"Database connection failed!");
}

export default dbConnect;