import { mock } from "node:test";
import React, { useState, useEffect } from "react";


export default function Flags() {
    
    const [flags, setFlags] = useState(0);

    const mockDisscusion = {
      name: "name",
      numFlags: 0
    }

    setFlags(mockDisscusion.numFlags)

    async function flagComment() {
        mockDisscusion.numFlags++;
        if (mockDisscusion.numFlags === 3) {
          removeComment();
        }
    }

    async function removeComment() {
        mockDisscusion = null;
    }

    

   

return (
  <div>
      <button onClick={() => addBookmark("example_discussion")}>Add Bookmark</button>
      <button onClick={() => removeBookmark("new_discussion")}>Remove Bookmark</button>
    </div>
)
}

