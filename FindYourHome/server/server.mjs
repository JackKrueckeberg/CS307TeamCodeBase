import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import city_populator from "./routes/city_populator.mjs";
import city_info from "./routes/city_info.mjs";
import Users from "./routes/loginRoute.mjs";
import EmailVerification from "./routes/emailVerification.mjs";;
import profile from "./routes/profileRoute.mjs";
import usersData from "./routes/usersData.mjs";
import createUser from "./routes/createUser.mjs";
import favorite_searches from "./routes/favorite_searches.mjs";
import favorite_cities from "./routes/favorite_cities.mjs";
import recent_searches from "./routes/recent_searches.mjs";
import get_tweet from "./routes/get_tweet.mjs"

//import DiscussionHome from "./routes/discussionPost.mjs"


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);
app.use("/city_populator", city_populator);
app.use("/city_info", city_info);
app.use("/loginRoute", Users);
app.use("/emailVerification", EmailVerification)
app.use("/profileRoute", profile);
app.use("/users", usersData);
app.use("/createUser", createUser);
app.use("/favorite_searches", favorite_searches);
app.use("/favorite_cities", favorite_cities);
app.use("/recent_searches", recent_searches);

app.use("/get_tweet", get_tweet);

//app.use("/discussionPost", discussion);

app.get('/getAttractions', async (req, res) => {
  const cityName = req.query.cityName;
  const GOOGLE_API_KEY = "AIzaSyC7T8MFYwJ84U8OpjRczDsZD8Mmk-Bm_KA";

  if (!cityName) {
      return res.status(400).send({ error: 'City name is required.' });
  }

  try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+in+${cityName}&key=${GOOGLE_API_KEY}`);
      return res.send(response.data);
  } catch (error) {
      return res.status(500).send({ error: 'Failed to fetch data from Google Places API.' });
  }
});



// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
