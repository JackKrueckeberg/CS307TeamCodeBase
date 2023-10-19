import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    //const twitterURL = "https://twitter.com/search?q=%23dallas&src=typed_query";
    const twitterURL = "https://twitter.com/dallasnews";
    const url = "https://publish.twitter.com/oembed?url=" + twitterURL;
    //const url = "https://publish.twitter.com/oembed?url=https://twitter.com/dallas";

    const results = await fetch(url, {
        method: "GET",
        headers: {

        },

    }).catch((error) => {
        console.log(error);
        return;
    });

    const resp = await results.json();

    console.log(resp.html);

    res.send(resp.html).status(200);

})

export default router;