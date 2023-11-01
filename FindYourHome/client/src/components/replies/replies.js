
import React, { useState, useEffect } from "react";
import { useUser } from '../../contexts/UserContext';
import { useCity } from "../../contexts/CityContext";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Replies() {
    
  const [discussion, setDiscussion] = useState({});
  const [banned, setBanned] = useState(false)
  const [username, setUsername] = useState("")
  const { city: globalCity } = useCity();
  const {user: userProfile } = useUser();

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

    
async function reply(index, content) {
  await user_data()
  if (!banned) {
  var curr = await getDiscussion()
    var _reply = {
        username: username,
        content: content
    }
  
    curr.comments[index].replies.push(_reply)
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
  
      curr.comments[0].replies.splice(index, 1)
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
      <button onClick={() => reply(0, "test reply")}>Reply</button>
      <button onClick={() => removeReply(0)}>Remove Reply</button>
    </div>
)
}

