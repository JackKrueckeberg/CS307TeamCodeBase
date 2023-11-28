async function test() {
      var new_discussion = 
      {
      username: "test",
      numFlags: 5,
      replies: [],
      content: "test content",
      username: "test_user",
      numlikes: 0
      }
        
        await fetch("http://localhost:5050/city_info/New York City", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({discussion: new_discussion})
      }).catch((error) => {
        //window.alert(error);
        console.log("error")
        return;
      });
        }




        test();