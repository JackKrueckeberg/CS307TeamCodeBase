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
import favorite_searches from "./routes/favorite_searches.mjs";
import recent_searches from "./routes/recent_searches.mjs";
import favorite_cities from "./routes/favorite_cities.mjs";

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
app.use("/favorite_searches", favorite_searches);
app.use("/recent_searches", recent_searches);
app.use("/favorite_cities", favorite_cities);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});