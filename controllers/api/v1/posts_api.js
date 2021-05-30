const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){


    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        

    return res.json(200, {
        message: "List of posts",
        data:{posts: posts,
        },
        success:true
    });

}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});


    
            return res.json(200, {
                data:{
                    post_id:req.params.id
                },

                message: "Post and associated comments deleted successfully!",
                success:true
            });
        }else{
            return res.json(401, {
                message: "You cannot delete this post!"
           ,
           success:false
            });
        }

    }catch(err){
        return res.json(500, {
            message: "Internal Server Error",
        success:false        });
    }
    
}
    
    module.exports.create = async function(req, res){
        try{
            let post = await Post.create({
                content: req.body.content,
                user: req.user._id
            });
            
                post = await post.populate('user').execPopulate();
    
                return res.json(200,{
                    data: {
                        post: post
                    },
                    message: "Post created!",
                    success:true
                });
            
    
            
        }catch(err){
        
                return res.json(500, {
                message: "Internal Server Error",
                success:false
            });
        
        }
      
    }
    

