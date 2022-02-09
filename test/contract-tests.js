// TODO: Tests need to be adjusted to the counter contract.
const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("MyContract", function () {
    this.timeout(50000);

    let myContract;
    let owner;
    let acc1;
    let acc2;

    this.beforeEach(async function () {
        // This is executed before each test
        // Deploying the smart contract
        const MyContract = await ethers.getContractFactory("MyContract");
        [owner, acc1, acc2] = await ethers.getSigners();

        myContract = await MyContract.deploy();
    })

    it("Should get count", async function () {
        expect(await myContract.get()).to.equal(0);
    });

    it("Should increment count", async function () {

        const tx = await myContract.inc();
        await tx.wait();

        expect(await myContract.get()).to.equal(1);
    })

    it("Should decrement count", async function () {

        const incTx = await myContract.inc();
        await incTx.wait();

        const decTx = await myContract.dec();
        await decTx.wait();

        expect(await myContract.get()).to.equal(0);
    })
});
