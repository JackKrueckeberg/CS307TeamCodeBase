
import React, { useState, useEffect } from "react";


export default function Flags() {


    
    const [discussion, setDiscussion] = useState({});

    const mockDisscusion = {
      name: "name",
      numFlags: 0
    }

    async function getDiscussion() {

      const city_info = await fetch("http://localhost:5050/city_info/New York City", {
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


    async function flagComment() {
        var curr = await getDiscussion()
        curr.comments[0].numFlags++;
        console.log(curr.comments[0].numFlags)
        if (curr.comments[0].numFlags >= 3) {
          removeComment(0);
        } else {
          console.log("right here")
          await fetch("http://localhost:5050/city_info/New York City", {
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
    }

    async function removeComment(commentIndex) {
      console.log("here")
      var curr = await getDiscussion();
      console.log(curr.comments)
      curr.comments.splice(commentIndex, 1);
      await fetch("http://localhost:5050/city_info/New York City", {
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
      <button onClick={() => flagComment()}>Flag Comment</button>
      
    </div>
)
}

