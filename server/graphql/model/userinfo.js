import mongoose from 'mongoose';

const schema = mongoose.Schema;
const userSchema = new schema({
    _userID:{
        type: String,
        required: true,
    },
    _userPwd:{
        type: String, 
        required: true, 
        trim: true
    },
    name:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
    },
    gender:{
        type:String,
    }
});

export default mongoose.model('user', userSchema);