const fs=require('fs');
const path=require('path');

const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const e = require('express');
const Post = require('../../../models/post');


module.exports.createSession = async function(req, res){

    try{
        let user = await User.findOne({email: req.body.email});

        if (!user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid username or password",
                success:false
            });
        }

        return res.json(200, {
            message: 'Sign in successful, here is your token, please keep it safe!',
            data:  {user:user,
                token: jwt.sign(user.toJSON(), 'codeial')
            }
            ,
            success:true
        })

    }catch(err){
    return res.json(500, {
            message: "Internal Server Error"
            ,
            success:false
        });
    }
}
module.exports.create = function(req, res){
    
    if (req.body.password != req.body.confirm_password){
        
        return res.json(401,{
            message:"Invalid Username and Password",
            success:false
        });

    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            return res.json(500, {
                message: "Internal Server Error",
                success:false
            
            });  
        }

        if (!user){
            User.create(req.body, function(err, user){
                if(err){  return res.json(500, {
                    message: "Internal Server Error",
                    success:false
                });  
                  }

            
            return res.json(200, {
            message: 'Sign up successful',
            data:  {user:user,
                token: jwt.sign(user.toJSON(), 'codeial')
            },
            success:true
            });
        
        
        
        });

    }else{
           return res.json(200,{
             message:"You have already sign up please login",
             success:false

            });

        }

    });
 
}

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
       if(user){
           return res.json(200,{
               data:{
                   user:user
               }
               ,
               success:true
           });
       }
       else{
           return res.json(401,{
               message:"User is not found",
               success:false
           });
       }
        
    });

}

module.exports.search= async function(req,res){
        
    try{

    const regex = new RegExp(req.query.text, "i");
    const result = await User.find({
      name: regex,
    }).select("name avatar");
    console.log(result);
    return res.status(200).json({
      success: true,
      data: {
        users: result,
      },
    });
    
    
}catch(error){
    return res.json(500,{
message:"Internal server error",
success:false
    });

}
}


module.exports.update = async function (req, res) {
    try {
      
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
if(err)
{
    return res.json(500,{
        message:"Internal Server Error",
        success:false
    })
}

        if(req.body.name){
        user.name = req.body.name;}
                if(req.body.password){
        user.password=req.body.password;
        }
        
    if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "../../../", user.avatar))) {
              fs.unlinkSync(path.join(__dirname, "../../../", user.avatar));
            }
          }
  
          //this is saving path of the uploaded file into the user avatr
          
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        // markModified('user');
        user.markModified('user.name');

         User.findByIdAndUpdate(req.params.id,user,(err,us)=>{
                })

        user.save();
        

        User.findOne({_id:req.params.id},function(err,us){
        

        });
        return res.json(200, {
          message: "user updated successfuly",
          success: true,
          data: {
            token: jwt.sign(user.toJSON(), "codeial"),
            user:user},
        });
      });
     
      
    } catch (err) {
          return res.json(500, {
        message: "internal server error",
      });
    }
  };
