const mongoose=require('mongoose');

const playerSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const player =mongoose.model("player",playerSchema);
module.exports=player;