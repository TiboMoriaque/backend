import express from "express";
import authRouter from "./routers/authRoute";
import roleRouter from "./routers/roleRoute";
import usersRouter from "./routers/userRouter";
import teamRouter from "./routers/teamRouter";
import customerRouter from "./routers/customerRoute";
import missionsRouter from "./routers/missionRoute";
import { connectToDB } from "./config/db";

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
connectToDB();

app.use("/auth", authRouter);
app.use("/roles", roleRouter);
app.use("/users", usersRouter);
app.use("/teams", teamRouter);
app.use("/customers", customerRouter);
app.use("/missions", missionsRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log("Server's running on port: " + PORT);
});
