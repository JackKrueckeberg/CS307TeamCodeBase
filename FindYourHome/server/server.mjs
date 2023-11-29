import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import city_populator from "./routes/city_populator.mjs";
import city_info from "./routes/city_info.mjs";
import Users from "./routes/loginRoute.mjs";
import EmailVerification from "./routes/emailVerification.mjs";
import EmailResetPassword from "./routes/emailForgotPassword.mjs"
import profile from "./routes/profileRoute.mjs";
import usersData from "./routes/usersData.mjs";
import favorite_searches from "./routes/favorite_searches.mjs";
import favorite_cities from "./routes/favorite_cities.mjs";
import recent_searches from "./routes/recent_searches.mjs";
import recent_discussion_searches from "./routes/recent_discussion_searches.mjs";
import get_tweet from "./routes/get_tweet.mjs";
import message from "./routes/messageRoute.mjs";
import messageBoard from "./routes/message_board.mjs";
import bookmarked_discussions from "./routes/bookmarked_discussions.mjs";
import favorite_discussions from "./routes/favorite_discussions.mjs";
import achievementsData from "./routes/achievementsData.mjs";
import twoFactor from "./routes/twoFactor.mjs";

import usageData from "./routes/usageData.mjs";
import topThreeCities from "./routes/topThreeCities.mjs";
import strikes from "./routes/strikes.mjs"
import DiscussionHome from "./routes/discussionPost.mjs"
import Feedback from "./routes/feedbackRoute.mjs";
import notification from "./routes/notificationsRoutes.mjs";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/record", records);
app.use("/city_populator", city_populator);
app.use("/city_info", city_info);
app.use("/loginRoute", Users);
app.use("/emailVerification", EmailVerification)
app.use("/emailForgotPassword", EmailResetPassword)
app.use("/profileRoute", profile);
app.use("/users", usersData);
app.use("/two-factor", twoFactor);
app.use("/createUser", usersData);
app.use("/favorite_searches", favorite_searches);
app.use("/favorite_cities", favorite_cities);
app.use("/recent_searches", recent_searches);
app.use("/recent_discussion_searches", recent_discussion_searches);
app.use("/get_tweet", get_tweet);
app.use("/bookmarked_discussions", bookmarked_discussions)
app.use("/favorite_discussions", favorite_discussions)
app.use("/messageRoute", message);
app.use("/messageBoard", messageBoard);
app.use("/strikes", strikes);
app.use("/notification", notification);
app.use("/achievements", achievementsData);
app.use("/usage_stats", usageData);
app.use("/top_cities", topThreeCities);
app.use("/discussionPost", DiscussionHome);
app.use("/feedbackRoute", Feedback);



// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
