import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // CredentialProvider({
    //   name:"credentials",
    //   credentials:{
    //     username:{label:"Email",type:"email",placeholder:"johndoe@test.com"},
    //     password:{label:"Password",type:"password",placeholder:"johndoe@test.com"}
    //   },
    //   authorize:(credentials)=>{
    //     //database look up
    //     if(credentials.username==="john" && credentials.password==="test"){
    //       return{
    //         name:"John",
    //         email:"johndoe@test.com"
    //       }
    //     }
    //     //login failed
    //     return null
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ...add more providers here
  ],
  // callbacks:{
  //   jwt:async()=>{},
  //   session:()=>{}
  // },
  secret:process.env.JWT_SECRET,
  // jwt:{
  //   secret:"test",
  //   encryption:true
  // },
  adapter: MongoDBAdapter(clientPromise),
})