import mongoose from "mongoose";


export const connectToDb = async () => {
    mongoose.set('strictQuery', true);

    if(mongoose.connection.readyState !== 1) {
      try {
          await mongoose.connect(process.env.MONGODB_URI)
          console.log("MongoDb connected")
      } catch (error) {
          console.log(error)
      }
    }
}
