import { prisma } from "../config/db.js";
    
const value = async (req, res) => {
    const { name, title, voteValue } = req.body;

    const UserExist = await prisma.user.findFirst({
        where : {name},
    })
    const PostExist = await prisma.post.findFirst({
        where : {title},
    })

    if(!UserExist || !PostExist){
        return res.status(401).json({message : "Either the user or the post does not exist"});
    }

    // Check if user already has a vote on this post
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId: UserExist.id,
                postId: PostExist.id,
            }
        }
    });

    let userVote = null;
    const newVoteValue = voteValue === "up" ? 1 : -1;

    if (existingVote) {
        // If clicking the same vote direction, remove the vote (toggle off)
        if (existingVote.value === newVoteValue) {
            await prisma.vote.delete({
                where: {
                    userId_postId: {
                        userId: UserExist.id,
                        postId: PostExist.id,
                    }
                }
            });
            userVote = null;
        } else {
            // Switching vote direction
            await prisma.vote.update({
                where: {
                    userId_postId: {
                        userId: UserExist.id,
                        postId: PostExist.id,
                    }
                },
                data: {
                    value: newVoteValue,
                }
            });
            userVote = voteValue;
        }
    } else {
        // No existing vote, create new one
        await prisma.vote.create({
            data: {
                userId: UserExist.id,
                postId: PostExist.id,
                value: newVoteValue,
            }
        });
        userVote = voteValue;
    }

    // Get total net score for this post (sum of all votes)
    const netScore = await prisma.vote.aggregate({
        where: { postId: PostExist.id },
        _sum: { value: true }
    })

    res.status(201).json({
        status: "Success",
        data: {
            post: PostExist.title,
            postId: PostExist.id,
            netScore: netScore._sum.value || 0,
            userVote: userVote,
        }
    })
}

const getValue = async (req, res) => {
    const { title, name } = req.query;

    // First find the post by title
    const post = await prisma.post.findFirst({
        where: { title },
    })

    if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Get total net score for this post (sum of all votes)
    const netScore = await prisma.vote.aggregate({
        where: { postId: post.id },
        _sum: { value: true },
    })

    // Get vote count
    const voteCount = await prisma.vote.count({
        where: { postId: post.id }
    })

    // Get current user's vote if name is provided
    let userVote = null;
    if (name) {
        const user = await prisma.user.findFirst({
            where: { name },
        });
        if (user) {
            const vote = await prisma.vote.findUnique({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: post.id,
                    }
                }
            });
            if (vote) {
                userVote = vote.value === 1 ? "up" : "down";
            }
        }
    }

    res.status(200).json({
        status: "Success",
        data: {
            post: post.title,
            postId: post.id,
            netScore: netScore._sum.value || 0,
            totalVotes: voteCount,
            userVote: userVote,
        }
    })
}
export {value, getValue}

