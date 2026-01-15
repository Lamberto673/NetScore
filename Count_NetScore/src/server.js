import express from "express";
import {config} from "dotenv";
import cors from "cors";
import {prisma, connectionDb, disconnectDB} from "./config/db.js"

// Import Routes
import Vote from "./routes/vote.js"
import Post from "./routes/post.js"
import Value from "./routes/Value.js"
import Delete from "./routes/Delete.js"

const app = express();

config();
connectionDb();
// Body Parser
app.use(express.json())
//Cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}))
// Routes 
app.use("/auth", Vote)
app.use("/content", Post)
app.use("/voting", Value)
app.use("/delete", Delete)

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`The server is listening at http://localhost:${PORT}`);
})

//HANDLE UNDHANDLED PROMISE REJECTIONS  (e.g., DATABASE CONNECTION ERRORS)
process.on("unhandledRejection", (err)=>{
    console.error("unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

//HANDLE UNCAUGHT EXCEPTION
process.on("UncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

//GRACEFUL SHUTDOWN
process.on("SIGTERM", async() => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async() =>{
        await disconnectDB();
        process.exit(0);
    });
});

