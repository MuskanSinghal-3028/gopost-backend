const Like = require("../../../models/like");
const Post =  require("../../../models/post");
const Comment = require('../../../models/comment');


module.exports.toggleLike = async function(req, res){
    try{

        let likeable;
        let deleted = false;


        if (req.query.likeable_type == 'Post'){
            likeable = await Post.findById(req.query.likeable_id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.likeable_id).populate('likes');
        }


        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.likeable_id,
            onModel: req.query.likeable_type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(req.user._id);
            likeable.save();

            existingLike.remove();
            deleted = true;

        }else{
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.likeable_id,
                onModel: req.query.likeable_type
            });

            likeable.likes.push(req.user._id);
            likeable.save();

        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                deleted: deleted
            },
            
            success:true
        })



    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}