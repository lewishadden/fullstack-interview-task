import { readFileSync } from "fs";
import path from "path";

import {
  getUserInvestments,
  getHoldingList,
  generateCSVReport,
  getHoldingAccountsMapping,
} from "../utils.js";

const investmentsData = require("./mockData/investments.json");
const companiesData = require("./mockData/companies.json");
const investmentsDataSheila = require("./mockData/investments_sheila.json");
const holdingsDataSheila = require("./mockData/holdings_sheila.json");
const csvReportSheila = readFileSync(
  path.join(__dirname, "/mockData/report_sheila.csv")
).toString();

global.fetch = jest.fn((url) => {
  const companyId = url.split("/").pop();
  return Promise.resolve({
    json: () => Promise.resolve(companiesData[companyId - 1]),
  });
});

describe("utils", () => {
  describe("getHoldingAccountsMapping", () => {
    beforeEach(() => {
      fetch.mockClear();
    });
    describe("for 1 company", () => {
      const accountIds = ["2"];
      it("should return the correct mapping data", async () => {
        const accountIdsMap = await getHoldingAccountsMapping(accountIds);
        expect(accountIdsMap).toEqual({
          2: companiesData[1],
        });
      });
    });
    describe("for multiple companies", () => {
      const accountIds = ["1", "3"];
      it("should return the correct mapping data", async () => {
        const accountIdsMap = await getHoldingAccountsMapping(accountIds);
        expect(accountIdsMap).toEqual({
          1: companiesData[0],
          3: companiesData[2],
        });
      });
      it("should make the correct API calls", async () => {
        await getHoldingAccountsMapping(accountIds);
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenCalledWith("http://localhost:8082/companies/1");
        expect(fetch).toHaveBeenCalledWith("http://localhost:8082/companies/3");
        expect(fetch).not.toHaveBeenCalledWith(
          "http://localhost:8082/companies/2"
        );
      });
    });
  });

  describe("getUserInvestments", () => {
    it("should return the correct investment data", () => {
      const userInvestments = getUserInvestments("2", investmentsData);
      expect(userInvestments).toEqual(investmentsDataSheila);
    });

    it("should return no data if user is not found", () => {
      const userInvestments = getUserInvestments("5", investmentsData);
      expect(userInvestments).toEqual([]);
    });
  });

  describe("getHoldingList", () => {
    it("should return the correct list of holdings", async () => {
      const holdingList = await getHoldingList(investmentsDataSheila);
      expect(holdingList).toEqual(holdingsDataSheila);
    });

    it("should return no data if investment data is empty", async () => {
      const holdingList = await getHoldingList([]);
      expect(holdingList).toEqual([]);
    });
  });

  describe("generateCSVReport", () => {
    it("should return the correct CSV string", () => {
      const csvString = generateCSVReport(holdingsDataSheila);
      expect(csvString).toEqual(csvReportSheila);
    });

    it("should return no CSV records if holdings data is empty", () => {
      const csvString = generateCSVReport([]);
      expect(csvString).toEqual(
        "|User|First Name|Last Name|Date|Holding|Value|"
      );
    });
  });
});
