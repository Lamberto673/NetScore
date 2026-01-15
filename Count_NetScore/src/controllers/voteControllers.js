import { prisma } from "../config/db.js";

const sign = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if user already exists
        let user = await prisma.user.findFirst({
            where : { name },
        });

        // If user doesn't exist, create one
        if(!user){
            user = await prisma.user.create({
                data: {
                    name,
                }
            })
        }
        
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    name: user.name, 
                    id: user.id,
                }
            }
        })
    } catch (err) {
        console.error("Sign error:", err);
        res.status(500).json({ message: "Server error" });
    }
} 
export {sign};