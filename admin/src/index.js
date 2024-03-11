import express from "express";
import config from "config";
import { inspect } from "util";

import {
  getUserInvestments,
  getHoldingList,
  generateCSVReport,
} from "./utils/utils.js";

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

app.get("/investments/report/:userId", async (req, res) => {
  const { userId } = req.params;
  const resp = await fetch(`${config.investmentsServiceUrl}/investments`);
  const investments = await resp.json();

  const userInvestments = getUserInvestments(userId, investments);
  const holdingList = await getHoldingList(userInvestments);
  const csvReport = generateCSVReport(holdingList);

  try {
    const resp = await fetch(
      `${config.investmentsServiceUrl}/investments/export`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvReport }),
      }
    );
    if (resp.status !== 204)
      throw new Error(
        `Error exporting CSV report. Expected status code: 204 but recieved ${resp.status}`
      );
    res.send(csvReport);
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
