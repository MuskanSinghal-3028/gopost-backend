const Comment = require('../../../models/comment');
const Post = require('../../../models/post');
const Like = require('../../../models/like');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post_id);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post_id,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email').execPopulate();
        

    
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!",
                    success:true
                });
           

        
        }
    }catch(err){
        return res.json(500, {
            message: "Internal Server Error",
            success:false
        });  
    }
     
}

module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findOne({_id:req.params.id});
        comment=await comment.populate('post').execPopulate();

       
                console.log(comment);

        if (comment.user == req.user.id  || comment.post.user == req.user.id){
          

            let postId=comment.post._id;

            
            comment.remove();

             await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            


            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
          
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                        post_id:postId
                    },
                    message: "Comment deleted",
                    success:true
                });
            
        }else{
            // req.flash('error', 'Unauthorized');
            // return res.redirect('back');
        return res.json(401,{
            message:"Unauthorized",
            success:false
        });

        }
    }catch(err){
        console.log(err);

        return res.json(500, {
            message: "Internal Server Error",
            success:false,
            error:err
        });  
    }
    
}