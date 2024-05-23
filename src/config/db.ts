import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async() => {
   try {

    // in mongoose we need to specify the listener before connecting to the db.
       mongoose.connection.on('connected', () => {
           console.log("Connected Successfully to database")
       })
   
       mongoose.connection.on('error', (err) => {
           console.log('Error in connecting DB.',err)
       })

    await mongoose.connect(config.dbUrl as string);
    
    
   } catch (error) {
    console.log("An Error Occured : ",error)
    process.exit(1);
   }
}

export default connectDB;