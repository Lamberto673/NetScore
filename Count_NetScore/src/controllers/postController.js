import { prisma } from "../config/db.js";

const post = async (req, res) => {
    const { title, name } = req.body;

    const UserExist = await prisma.user.findFirst({
        where: { name }
    })
    if(!UserExist){
        return res.status(401).json({message : "Sign first"})
    }
    const post = await prisma.post.create({
        data :{
            title,
            authorName: name,
        }
    })

    res.status(201).json({
        status: "Success",
        data: {
            id: post.id,
            title: post.title,
            authorName: post.authorName,
        }
    })
}

const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            status: "Success",
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        });
    }
}

export {post, getPosts};