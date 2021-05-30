const express = require('express');

const router = express.Router();
const passport=require('passport');

const friendsApi = require('../../../controllers/api/v1/friendships_api');

router.get('/fetch_user_friends',passport.authenticate('jwt', {session: false}),friendsApi.fetchFriends);
router.post('/create_friendship',passport.authenticate('jwt', {session: false}),friendsApi.createFriends);
router.delete('/remove_friendship',passport.authenticate('jwt', {session: false}),friendsApi.removeFriends);

module.exports=router;
