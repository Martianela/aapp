const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const app = express();
const port = 3000;

app.use(express.json());

mongoose.set("strictQuery", false);
app.use("/user", userRoute);

mongoose
  .connect(
    "mongodb+srv://saranshh2:0DFauPCVmJBFSGBu@cluster0.7cyagzw.mongodb.net/leetcode?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
