const User=require('../../../models/user');
const Friendship=require('../../../models/friendship');
const { populate, model } = require('../../../models/user');

module.exports.fetchFriends=async function(req,res){
if(req.user){

    let user=await req.user.populate({path:'friendships'
    ,
    populate:{
        path:'to_user'
    }}).execPopulate();

    
     return res.json(200,{
      data:{
    friends:user.friendships  
    },
    success:true
     });


}
else{

    return res.json(401,{
        message:"Cannot fetch friends",
        success:false
    });

}

}


module.exports.createFriends= async function(req,res){
try{
    let to_user=await User.findById(req.query.user_id);

checkFriend1=await Friendship.findOne({

    from_user:req.user._id,
    to_user:to_user._id
});

checkFriend2=await Friendship.findOne({

    from_user:to_user._id,
    to_user:req.user._id
});

if(checkFriend1||checkFriend2){
    return res.json(401,{
        message:"User is already a friend of yours",
        success:false
    });

}
else{
let friendship1=await Friendship.create({
    from_user:req.user._id,
    to_user:to_user._id
});

let friendship2=await Friendship.create({
    from_user:to_user._id,
    to_user:req.user._id
});

await req.user.friendships.push(friendship1._id);
 await req.user.save();

await to_user.friendships.push(friendship2._id);
await to_user.save();

 friendship1=await friendship1.populate('from_user').populate('to_user').execPopulate();

return res.json(200,{
    message:"Add friend successfully",
    success:true,
    data:{
        friendship:friendship1
    }
});
}

}
catch(error){
return res.json(500,{
    message:"Internal server error",
    success:false,
    error:error
});

}



}


module.exports.removeFriends=async function(req,res){
try{
let friendship1=await Friendship.findOne({
from_user:req.user._id,
to_user:req.query.user_id
});

let friendship2=await Friendship.findOne({
    from_user:req.query.user_id,
    to_user:req.user._id
    });
if(friendship2&&friendship1)
{
//  friendship1.remove();
//  friendship2.remove();


  let user1=await User.findByIdAndUpdate(req.user._id,{$pull:{friendships:friendship1._id}});
  let user2=await User.findByIdAndUpdate(req.query.user_id,{$pull:{friendships:friendship2._id}});

 await friendship1.remove();
 await friendship2.remove();
 return res.json(200,{
     message:"Friend removed",
     success:true
 });


}
else{
    return res.json(401,{
     message:"Friendship does not exist",
     success:false
    });

}
}
catch(error)
{
    return res.json(500,{
        message:"Internal server error",
        success:false
    });

}

  }