const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI).then(con =>{
console.log(`mongoose db connected with HOST:${con.connection.host}`)


    }).catch((error) => console.log(error));
}
module.exports = connectDatabase;

// module.exports={
//     mongoDbUrl:'mongodb://localhost:27017/ecommerce'
// }