import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res){
    try{
        //id and _id both of them work
     const currentUserId=req.user.id;
     const currentUser=req.user

     //I don't want to see myself and my friends in recommended Usess
     const recommendedUsers=await User.find({
        $and:[
            {_id:{$ne:currentUserId}},//exclude current user
            {_id:{$nin:currentUser.friends}},//exclude current user's friends
            {isOnboarded:true}
        ]
     })

     res.status(200).json(recommendedUsers)

    }catch(error){
        console.log("Error in recommended User end point",error.message);
        res.status(500).json({message:"Internal Server Error"});

        

    }


}

export async function getMyFriends(req,res){

    try{
        const user=await User.findById(req.user.id).select("friends").populate("friends","fullName profilePic nativeLanguage learningLanguage")
        console.log("Logging the friends",user.friends);
        

        res.status(200).json(user.friends)
    }catch(error){
        console.error("Error in getMyFriends Controller",error.message);
        
         res.status(500).json({message:"Internal Server Error"});

    }

}

export async function sendFriendRequest(req,res){
    try{
        const myId=req.user.id
        //paramas alli id en irutto, renamed to recipientId
        const {id:recipientId}=req.params

        //prevent sending request to yourself

        if(myId.toString()===recipientId.toString()){
            return res.status(400).json({message:"You can't send friend request to yourself"});
        }
        const recipient=await User.findById(recipientId)
        if(!recipient){
            return res.status(401).json({message:"Recipient not found"})
        }
         //check if user is already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"You are already friends with this user"})
        }

        //check if request already exists
        const existingRequest=await FriendRequest.findOne({
            $or:[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId}
            ]
        })
        if(existingRequest){
            return res.status(400).json({message:"A friend request already exists between you and this user"})
        }

        const friendRequest=await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        })
        res.status(201).json(friendRequest)

    }catch(error){
 console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }

}

export async function acceptFriendRequest(req,res){
    try{
        const {id:requestId}=req.params
        const friendRequest=await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"friend request not found"})
        }
        //verify current user is the recipient 
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"You are not authorized to accept the request"})
        }
        friendRequest.status="accepted";
        await friendRequest.save()
        //add each user to the other's friends array
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })
         await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })
        res.status(200).json({ message: "Friend request accepted" });


    }catch(error){
console.log("Error in acceptFriendRequest controller", error.message);
  
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequests(req,res){
    try{
        const incomingReqs=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage")

        const acceptedReqs=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient","fullName profilePic")
        res.status(200).json({incomingReqs,acceptedReqs})

    }catch(error){
         console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });

    }

}

export async function getOutgoingFriendReqs(req,res){
     try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}