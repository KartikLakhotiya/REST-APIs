import app from "./src/app"

console.log("Welcome to Ebook APIs.")

const StartServer = () => {
    const port = process.env.PORT || 3000

    app.listen(port, () => {
        console.log(`Listening on https://localhost:${port}`)
    })
}

StartServer();