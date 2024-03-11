import express from "express";
import config from "config";
import { inspect } from "util";

const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/investments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const resp = await fetch(
      `${config.investmentsServiceUrl}/investments/${id}`
    );
    const investments = await resp.json();
    res.send(investments);
  } catch (e) {
    console.error(inspect(e, false, null, true));
    res.sendStatus(500);
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
