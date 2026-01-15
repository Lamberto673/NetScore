import { prisma } from "../config/db.js";

const Delete = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ message: "Post ID is required" });
    }
    
    const postExist = await prisma.post.findFirst({
        where: { id },
    })
    if (!postExist) {
        return res.status(404).json({ message: "This post is not found" });
    }
    
    // Delete related votes first (if any)
    await prisma.vote.deleteMany({
        where: { postId: id },
    });
    
    const deletedPost = await prisma.post.delete({
        where: { id },
    })

    res.status(200).json({
        status: "Success",
        data: {
            id: deletedPost.id,
            title: deletedPost.title,
        }
    })
}
export { Delete };