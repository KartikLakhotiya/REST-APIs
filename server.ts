import app from "./src/app"
import { config } from "./src/config/config"

console.log("Welcome to Ebook APIs.")

const StartServer = () => {
    const port = config.port || 3000

    app.listen(port, () => {
        console.log(`Listening on Port ${port}`)
    })
}

StartServer();