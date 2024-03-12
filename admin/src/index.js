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
  try {
    const investments = await fetch(
      `${config.investmentsServiceUrl}/investments`
    ).then((resp) => resp.json());

    const userInvestments = getUserInvestments(userId, investments);
    const holdingList = await getHoldingList(userInvestments);
    const csvReport = generateCSVReport(holdingList);

    const { status: exportStatus } = await fetch(
      `${config.investmentsServiceUrl}/investments/export`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvReport }),
      }
    );
    if (exportStatus !== 204)
      throw new Error(
        `Error exporting CSV report. Expected status code: 204 but recieved ${exportStatus}`
      );

    res.set("Content-Type", "text/csv").send(csvReport);
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
