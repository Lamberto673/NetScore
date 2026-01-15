
import Api from "./api.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";

interface Props{
    Task: string,
    index: number,
    Name: string,
    Colors: string,
    TitleId: string,
    onDelete: () => void,
    Border: string,
    Text: string
}

function Post({Task, index, Name, Colors, TitleId, onDelete, Border, Text}:Props){
    const [netScore, setNetScore] = useState<number>(0);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
    const [isVoting, setIsVoting] = useState<boolean>(false);
    
    const displayName = Name || "Anonymous";
    const currentUser = localStorage.getItem('currentUser') || "";
    

    // Fetch the current vote count on mount
    useEffect(() => {
        fetchVoteCount();
    }, []);

    const fetchVoteCount = async () => {
        try {
            const response = await Api.get("/voting/getVote", {
                params: { title: Task, name: currentUser }
            });
            if (response.data.status === "Success") {
                setNetScore(response.data.data.netScore);
                setUserVote(response.data.data.userVote);
            }
        } catch (err) {
            console.log("Error fetching vote count:", err);
        }
    };
    
    const DeletePost = async () => {
        try {
            await Api.delete(`/delete/post/${TitleId}`);
            onDelete(); // Refresh posts after deletion
        } catch (err) {
            console.log("Error deleting post:", err);
        }
    };

    const handleVote = async (voteType: "up" | "down") => {
        if (isVoting) return; // Prevent double-clicking
        setIsVoting(true);
        
        try {
            const response = await Api.post("/voting/vote", {
                name: currentUser,
                title: Task,
                voteValue: voteType,
            });
            
            if (response.data.status === "Success") {
                setNetScore(response.data.data.netScore);
                setUserVote(response.data.data.userVote);
            }
        } catch (err) {
            console.log('Error voting on this post:', err);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="ListPost" style={{"backgroundColor":Border}}>
            <div className="HeaderPost">
                <div className="Profile" style={{"backgroundColor":Colors}}><h4 className="ProfilePic">{displayName.charAt(0)}</h4></div>
                <div className="User">
                    <h4 className="Username" style={{"color":Text}}>{displayName}</h4>
                    <p style={{"color" : Text}}>User Proxy</p>
                </div>
                <div className="Delete" onClick={DeletePost}>
                    <p><FontAwesomeIcon icon={faTrash} /></p>
                </div>
            </div>
            <p className="Task" style={{"color":Text}}key={index}>{Task}</p>
            <div className="UpvoteDownVote">
                <p 
                    onClick={() => handleVote("down")} 
                    style={{
                        cursor: isVoting ? "not-allowed" : "pointer",
                        color: userVote === "down" ? "#ff4500" : Text,
                    }}
                >
                    <FontAwesomeIcon icon={faArrowDown} />
                </p>
                <h4 style={{"color":Text}} className="Number">{netScore}</h4>
                <p 
                    onClick={() => handleVote("up")} 
                    style={{
                        cursor: isVoting ? "not-allowed" : "pointer",
                        color: userVote === "up" ? "#00ff00" : Text,
                    }}
                >
                    <FontAwesomeIcon icon={faArrowUp} />
                </p>
            </div>
        </div>
    )
}

export default Post;