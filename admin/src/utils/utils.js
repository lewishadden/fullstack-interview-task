export const getUserInvestments = (userId, investments) => {
  const userInvestments = investments.filter(
    (investment) => investment.userId === userId
  );
  return userInvestments;
};

export const getHoldingList = (userInvestments) => {
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

  return holdingList;
};
