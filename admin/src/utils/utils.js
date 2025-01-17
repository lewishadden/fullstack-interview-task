import config from "config";

export const getHoldingAccountsMapping = async (accountIds) => {
  const accountIdsMap = {};
  for (let accountId of accountIds) {
    const resp = await fetch(
      `${config.financialCompaniesServiceUrl}/companies/${accountId}`
    );
    const company = await resp.json();
    accountIdsMap[accountId] = company;
  }
  return accountIdsMap;
};

export const getUserInvestments = (userId, investments) => {
  const userInvestments = investments.filter(
    (investment) => investment.userId === userId
  );
  return userInvestments;
};

export const getHoldingList = async (userInvestments) => {
  let holdingList = [];
  const accountIds = new Set();

  userInvestments.forEach(
    ({ userId, firstName, lastName, investmentTotal, date, holdings }) => {
      holdings.forEach(({ id, investmentPercentage }) => {
        accountIds.add(id);
        const value = investmentTotal * investmentPercentage;
        const holdingData = {
          user: userId,
          firstName,
          lastName,
          date,
          account: id,
          value,
        };
        holdingList.push(holdingData);
      });
    }
  );

  const accountIdsMap = await getHoldingAccountsMapping(accountIds);
  holdingList = holdingList.map((holding) => ({
    ...holding,
    account: accountIdsMap[holding.account].name,
  }));

  return holdingList;
};

export const generateCSVReport = (holdingList) => {
  const csvHeaders = "|User|First Name|Last Name|Date|Holding|Value|";
  const csvRows = holdingList.map(
    ({ user, firstName, lastName, date, account: holding, value }) =>
      `|${user}|${firstName}|${lastName}|${date}|${holding}|${value}|`
  );
  const csvReport = [csvHeaders, ...csvRows].join("\n");

  return csvReport;
};
