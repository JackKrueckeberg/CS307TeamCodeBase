import { mock } from "node:test";
import React, { useState, useEffect } from "react";


export default function Flags() {
    
    const [replies, setReplies] = useState([]);
    const [user, setLoggedinUser] = useUser();

    const mockDisscusion = {
      name: "name",
      comment: {
        text: "",
        replies: []
      }
      
    }

    setReplies(mockDisscusion.comments.replies)

    async function reply(reply) {
      if(!user.strikes.is_banned) {
        mockDisscusion.comment.replies.push(reply)
      } else {
        console.log("You can't reply to this post")
      }
        
    }

    async function removeReply(reply_text) {
        var temp = [];
        for (var i = 0; i < replies.length; i++) {
          if (!(replies[i] === reply_text)) {
            temp.add[replies[i]];
          }
        }
        setReplies(temp);

    }

    

   

return (
  <div>
      <button onClick={() => addBookmark("example_discussion")}>Add Bookmark</button>
      <button onClick={() => removeBookmark("new_discussion")}>Remove Bookmark</button>
    </div>
)
}

