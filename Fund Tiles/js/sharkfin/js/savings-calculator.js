(function () {
  const calculateSalary = (startingSalary, annualSalaryGrowth, yearsOfGrowth) => {
    return startingSalary * Math.pow((1 + annualSalaryGrowth), yearsOfGrowth);
  };

  const calculateContribution = (salary, annualContributionRate, withdrawalRate, inRetirement) => {
    if (inRetirement) {
      return (salary * withdrawalRate) * -1;
    } else {
      return salary * annualContributionRate;
    }
  };

  const calculatePrincipal = (savingsData, yearsOfGrowth, startingBalance) => {
    let previousYearContribution;
    let previousYearInterest;
    let previousYearPrincipal;

    if (yearsOfGrowth === 0) {
      previousYearContribution = 0;
      previousYearInterest = 0;
      previousYearPrincipal = startingBalance;
    } else {
      previousYearContribution = savingsData[yearsOfGrowth - 1].contribution;
      previousYearInterest = savingsData[yearsOfGrowth - 1].interest;
      previousYearPrincipal = savingsData[yearsOfGrowth - 1].principal;
    }

    return previousYearPrincipal + previousYearContribution + previousYearInterest;
  };

  const calculateInterest = (inRetirement, returnsBeforeRetirement, returnsAfterRetirement, contribution, principal) => {
    const returnRate = inRetirement ? returnsAfterRetirement : returnsBeforeRetirement;
    return returnRate * (contribution + principal);
  };

  sharkFinApp.calculateSavingsData = (savingsAssumptions) => {
    const {
      ageYears,
      startingAge,
      retirementAge,
      startingBalance,
      startingSalary,
      annualSalaryGrowth,
      annualContributionRate,
      returnsBeforeRetirement,
      returnsAfterRetirement,
      withdrawalRate,
    } = savingsAssumptions;

    return ageYears.reduce((savingsData, age, index) => {
      const inRetirement = (age >= retirementAge);

      const yearsOfSalaryGrowth = inRetirement ? retirementAge - startingAge : index;

      const salary = calculateSalary(startingSalary, annualSalaryGrowth, yearsOfSalaryGrowth)
      const contribution = calculateContribution(
        salary,
        annualContributionRate,
        withdrawalRate,
        inRetirement
      );
      const principal = calculatePrincipal(savingsData, index, startingBalance);
      const interest = calculateInterest(
        inRetirement,
        returnsBeforeRetirement,
        returnsAfterRetirement,
        contribution,
        principal
      );

      const currentYearSavingsData = {
        salary,
        contribution,
        interest,
        principal,
        age,
      };

      savingsData.push(currentYearSavingsData);

      return savingsData;
    }, []);
  };

  sharkFinApp.highestPrincipal = R.pipe(
    R.map(R.prop('principal')),
    _.max,
  );

  sharkFinApp.ageWhenSavingsRunsOut = R.pipe(
    R.remove(0, 1),
    R.find(data => data.principal <= 0),
    R.prop('age'),
  );

})();
