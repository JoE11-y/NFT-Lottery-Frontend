export const increaseCount = async (counterContract, performActions) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await counterContract.methods.inc().send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};

export const decreaseCount = async (counterContract, performActions) => {
  try {
    await performActions(async (kit) => {
      const { defaultAccount } = kit;
      await counterContract.methods.dec().send({ from: defaultAccount });
    });
  } catch (e) {
    console.log({ e });
  }
};
