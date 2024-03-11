export const getUserInvestments = (userId, investments) => {
  const userInvestments = investments.filter(
    (investment) => investment.userId === userId
  );
  return userInvestments;
};
