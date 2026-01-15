import { PrismaClient } from "../generated/prisma/client.ts";
import {PrismaPg} from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});

const connectionDb = async () => {
    try{
        await prisma.$connect()
        console.log("DB connected via Prisma")
    }catch(err){
        console.error(`DB connection error:${err.message}`)
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
};

export {prisma, connectionDb, disconnectDB};