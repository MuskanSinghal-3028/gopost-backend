const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://Muskan:liyXObl4jfLXQwG0@cluster0.9nmeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');




// WV4JbInkqPehcaZw
mongoose.connect("mongodb+srv://MuskanSinghal:WV4JbInkqPehcaZw@cluster0.9nmeo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
     console.log('Connected to Database :: MongoDB');
});
// WV4JbInkqPehcaZw


module.exports = db;