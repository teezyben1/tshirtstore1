const mongoose = require('mongoose')


const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('DB CONNECTED')
        
    } catch (error) {
        console.log('DB NOT CONNECTED')
        console.log(error)
        process.exit(1)
        
    }

}




module.exports = connectToDb