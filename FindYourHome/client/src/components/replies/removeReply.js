
import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useCity } from "../../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function RemoveReply({commentIndex}) {
    
  const [discussion, setDiscussion] = useState({});
  const [banned, setBanned] = useState(false)
  const [username, setUsername] = useState("")
  const { city: globalCity } = useCity();
  const {user: userProfile } = useUser();
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Call the function to get favorite cities when the component mounts
    user_data()
}, []); 

 

  async function getDiscussion() {

    const city_info = await fetch("http://localhost:5050/city_info/" + globalCity.name, {
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

async function user_data() {

  const user_info = await fetch("http://localhost:5050/users/" + userProfile.email, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    window.alert(error);
    return;
  });

  const resp = await user_info.json();

  setBanned(resp.strikes.is_banned);
  setUsername(resp.username)


  return resp;
} 

    
async function reply(content) {
  await user_data()
  if (!banned) {
  var curr = await getDiscussion()

  
    curr.comments[commentIndex].replies.push({username, content})
    await fetch("http://localhost:5050/city_info/" + globalCity.name, {
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
  } else {
    window.alert("You are banned from commenting!")
  }
}

    async function removeReply(index) {
      var curr = await getDiscussion()
  
      curr.comments[commentIndex].replies.splice(index, 1)
      await fetch("http://localhost:5050/city_info/" + globalCity.name, {
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
          <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply"
          />
          <button onClick={() => reply(replyContent)}>Reply</button>
          <button onClick={() => removeReply(0)}>Remove Reply</button>
      </div>
  );
}

