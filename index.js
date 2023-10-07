const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors())


const PORT = process.env.PORT;

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

app.use(express.json());

app.use("/", indexRouter);
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`seriver listening on port ${PORT}`));
