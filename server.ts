import app from "./src/app"
import { config } from "./src/config/config"
import connectDB from "./src/config/db"

console.log("Welcome to Ebook APIs.")

const StartServer = async() => {

    await connectDB();
    
    const port = config.port || 3000

    app.listen(port, () => {
        console.log(`Listening on Port ${port}`)
    })
}

StartServer();