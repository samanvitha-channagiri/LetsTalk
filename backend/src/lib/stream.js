import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey=process.env.STREAM_API_KEY
const apiSecret=process.env.STREAM_API_SECRET

if(!apiKey||!apiSecret){
    console.log("Stream API key or Secret is missing");

    
    
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async (userData)=>{
    try{
       
        await streamClient.upsertUsers([userData]);
        return userData


    }catch(error){
        console.log("Error upserting Stream user:",error);
        

    }

}


export const generateStreamToken=(userId)=>{
    try{
        //ensure userId is a string

        const userIdStr=userId.toString()
        return streamClient.createToken(userIdStr);
    }catch(error){
        console.error("Error generating Stream token",error);
        
    }



}


//upsert means create or update depending on the user's existence


// Why an array for upsertUsers function?

// The API is designed to handle batch operations: you can upsert multiple users in one network call.

// Even if you only have a single user to sync, you wrap it in an array ([userData]) so it fits the batch‐upsert signature.