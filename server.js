"use strict"

const dotenv = require("dotenv")
// dotenv.config({path:'./config/.env'})

const http = require('http')

process.on('uncaughtException', err =>{
    console.log(err)
    console.log(err.name , err.message);
    console.log("Unhandler Rejection ! Shutting down...")
    process.exit(1)
    
})
const config = require("./config")
const app = require("./app")
const {dbConnection} = require("./config/dbConnection")

const {port} = config.server
// const {token_Secret, token_Expires} = config.token


console.log(process.env.DB_NAME )

dbConnection()
console.log("your port is ", port)
// console.log("your Token Secret is ", token_Secret, token_Expires)

app.set('port', port)

const server = http.createServer(app)

const serverdata = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

process.on('unhandledRejection', err =>{
    console.log(err.name , err.message);
    console.log("Unhandler Rejection ! Shutting down...")
    serverdata.close(()=>{

        process.exit(1)
    });
})


