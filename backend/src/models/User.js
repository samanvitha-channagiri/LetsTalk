import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    bio:{
        type:String,
        default:""
    },
    profilePic:{
    type:String,
    default:""
    },
    nativeLanguage:{
        type:String,
        default:""
    },
    learningLanguage:{
        type:String,
        default:"",
    },
    isOnboarded:{
        type:Boolean,
        default:false
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]

},
{timestamps:true});
console.log(mongoose.model);
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();

    }catch(error){
        next(error);

    }
})
const User=mongoose.model("User",userSchema)

//pre hook--before saving the user into db, we've to hash their passwords




export default User;

//once they complete the onBoarding process, isOnboarded will be set to true, only then user will be able to visit the chat page
