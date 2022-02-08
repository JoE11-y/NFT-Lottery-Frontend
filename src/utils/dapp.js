
// fetch all NFTs on the smart contract
export const increaseCount = async (minterContract, performActions) => {
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit
            await minterContract.methods.inc().send({from: defaultAccount});
        })
    } catch (e) {
        console.log({e});
    }
};

export const decreaseCount = async (minterContract, performActions) => {
    try {
        await performActions(async (kit) => {
            const {defaultAccount} = kit
            await minterContract.methods.dec().send({from: defaultAccount});
        })
    } catch (e) {
        console.log({e});
    }
};



