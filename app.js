import express from "express";
import { PORT } from "./env.js";
import { fileURLToPath } from "url";
import path from "path";
import { authRouter } from "./routes/authRouter.js";
import { dashboardRouter } from "./routes/dashboardRouter.js";

const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirname = fileURLToPath(new URL(".", import.meta.url));

app.use(express.static(path.join(_dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/", authRouter);
app.use("/", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
