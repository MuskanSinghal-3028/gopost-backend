const express = require('express');

const router = express.Router();
const passport=require('passport');

const usersApi = require('../../../controllers/api/v1/users_api');


router.post('/login', usersApi.createSession);
router.post('/signup',usersApi.create);
router.get('/:id',passport.authenticate('jwt', {session: false}),usersApi.profile);
// router.get('/search',passport.authenticate('jwt', {session: false}),usersApi.search);
router.post('/search',passport.authenticate('jwt', {session: false}),usersApi.search);

// router.post('/edit/:id',passport.authenticate('jwt', {session: false}),usersApi.update);
router.post('/edit/:id',usersApi.update);

// router.post('/edit',usersApi.update);

module.exports = router;