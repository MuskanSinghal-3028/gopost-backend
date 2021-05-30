const express = require('express');

const router = express.Router();



router.use('/api', require('./api'));
// router.get('/',function(req,res){

// })
// router.get('/',(req,res)=>{
//     res.send(GetResponse);
// })
// const GetResponse = `<pre>How To Use This API
//     1. Method of request must be POST
//     2. URL is https://globalshalamail.herokuapp.com/
//     3. Set the headers of request as follows:
//         a. 'Accept':'application/json, text/plain, /'
//         b. 'Content-Type':'application/json'
//     4. Set the body of request, for syntax check the /input formate/sample.txt</pre>`;




module.exports = router;