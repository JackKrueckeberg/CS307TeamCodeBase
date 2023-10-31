
import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useLocalStorage } from "@uidotdev/usehooks";


export default function Replies() {
    
  const [discussion, setDiscussion] = useState({});
  const {user: userProfile } = useUser(); // the id of the current logged in user

  async function getDiscussion() {

    const city_info = await fetch("http://localhost:5050/city_info/" + userProfile.email, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      window.alert(error);
      return;
    });

    const resp = await city_info.json();
  

    setDiscussion(resp.discusssion);

    console.log(resp.discussion);

    return resp.discussion;
}

    

    
async function reply(index, content) {
  var curr = await getDiscussion()
  
    curr.comments[index].replies.push(content)
    await fetch("http://localhost:5050/city_info/" + userProfile.email, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({discussion: curr})
    }).catch((error) => {
      //window.alert(error);
      console.log("error")
      return;
    });
  
}

    async function removeReply(index) {
      var curr = await getDiscussion()
  
      curr.comments[0].replies.splice(index, 1)
      await fetch("http://localhost:5050/city_info/" + userProfile.email, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({discussion: curr})
      }).catch((error) => {
        //window.alert(error);
        console.log("error")
        return;
      });

    }

    

   

return (
  <div>
      <button onClick={() => reply(0, "test reply")}>Reply</button>
      <button onClick={() => removeReply(0)}>Remove Reply</button>
    </div>
)
}

