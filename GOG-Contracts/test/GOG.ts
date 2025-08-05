import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import "@nomicfoundation/hardhat-chai-matchers";
describe("GameOfGreed", function () {
  async function deployFixture() {
    const [owner, player1, player2, outsider] = await hre.ethers.getSigners();
    const ERC20Mock = await hre.ethers.getContractFactory("ERC20Mock");
    const token = await ERC20Mock.connect(owner).deploy("Mock USDC", "mUSDC");
    const initialBalance = hre.ethers.parseUnits("1000", 18);
    await token.mint(player1.address, initialBalance);
    await token.mint(player2.address, initialBalance);
    

    let bal1 = await token.balanceOf(player1.address);
    let bal2 = await token.balanceOf(player2.address);

    const GameOfGreed = await hre.ethers.getContractFactory("GameOfGreed");
    const game = await GameOfGreed.deploy(await token.getAddress());

    return { token, game, owner, player1, player2, outsider, initialBalance };
  }

  describe("Room creation & joining", function () {
    it("should create a room with correct stake", async function () {
      const { game, token, player1 } = await deployFixture();
      const stake = hre.ethers.parseUnits("10", 18);

      await token.connect(player1).approve(game.target, stake);
      await game.connect(player1).createRoom(stake);
      expect(await game.roomCounter()).to.equal(1);
      const room = await game.rooms(1);
      expect(room.player1).to.equal(player1.address);
      expect(room.stakeAmount).to.equal(stake);
    });
  });

  //   it("should allow another player to join", async function () {
  //     const { game, token, player1, player2 } = await deployFixture();
  //     const stake = hre.ethers.parseUnits("10", 18);

 
  //     await token.connect(player1).approve(game.target, stake);
  //     await game.connect(player1).createRoom(stake);

     
  //     await token.connect(player2).approve(game.target, stake);
  //     await expect(game.connect(player2).joinRoom(1))
  //       .to.emit(game, "PlayerJoined")
  //       .withArgs(1, player2.address);

  //     const room = await game.rooms(1);
  //     expect(room.player2).to.equal(player2.address);
  //   });

  //   it("should not allow player to join their own room", async function () {
  //     const { game, token, player1 } = await deployFixture();
  //     const stake = hre.ethers.parseUnits("10", 18);

  //     await token.connect(player1).approve(game.target, stake);
  //     await game.connect(player1).createRoom(stake);

  //     await expect(game.connect(player1).joinRoom(1)).to.be.revertedWith("Can't join own room");
  //   });
  // });

  // describe("Game decisions & payouts", function () {
  //   async function setupRoomAndJoin() {
  //     const { game, token, player1, player2 } = await deployFixture();
  //     const stake = hre.ethers.parseUnits("10", 18);


  //     await token.connect(player1).approve(game.target, stake);
  //     await game.connect(player1).createRoom(stake);

   
  //     await token.connect(player2).approve(game.target, stake);
  //     await game.connect(player2).joinRoom(1);

  //     return { game, token, player1, player2, stake };
  //   }

  //   it("should split funds if both choose SPLIT", async function () {
  //     const { game, token, player1, player2, stake } = await setupRoomAndJoin();

  //     await game.connect(player1).makeDecision(1, 2); // SPLIT
  //     await game.connect(player2).makeDecision(1, 2); // SPLIT

  //     const bal1 = await token.balanceOf(player1.address);
  //     const bal2 = await token.balanceOf(player2.address);

  //     expect(bal1).to.equal(hre.ethers.parseUnits("1000", 18));
  //     expect(bal2).to.equal(hre.ethers.parseUnits("1000", 18));
  //   });

  //   it("should give all funds to STEAL player if other chooses SPLIT", async function () {
  //     const { game, token, player1, player2, stake } = await setupRoomAndJoin();

  //     await game.connect(player1).makeDecision(1, 1); // STEAL
  //     await game.connect(player2).makeDecision(1, 2); // SPLIT

  //     const bal1 = await token.balanceOf(player1.address);
  //     const bal2 = await token.balanceOf(player2.address);

  //     expect(bal1).to.equal(hre.ethers.parseUnits("1020", 18));
  //     expect(bal2).to.equal(hre.ethers.parseUnits("980", 18));
  //   });

  //   it("should keep funds in contract if both choose STEAL", async function () {
  //     const { game, token, player1, player2, stake } = await setupRoomAndJoin();

  //     await game.connect(player1).makeDecision(1, 1); // STEAL
  //     await game.connect(player2).makeDecision(1, 1); // STEAL

  //     const gameBalance = await token.balanceOf(game.target);
  //     expect(gameBalance).to.equal(stake.mul(2));
  //   });
  // });

  // describe("Time expiration", function () {
  //   it("should lock funds if time expires before both decide", async function () {
  //     const { game, token, player1, player2 } = await deployFixture();
  //     const stake = hre.ethers.parseUnits("10", 18);


  //     await token.connect(player1).approve(game.target, stake);
  //     await game.connect(player1).createRoom(stake);
  //     await token.connect(player2).approve(game.target, stake);
  //     await game.connect(player2).joinRoom(1);

    
  //     await game.connect(player1).makeDecision(1, 1); // STEAL


  //     await time.increase(601);

  //     await expect(game.forceResolve(1))
  //       .to.emit(game, "GameResolved")
  //       .withArgs(1, "Time expired: Funds locked in contract");

  //     expect(await token.balanceOf(game.target)).to.equal(stake.mul(2));
  //   });
  // });

});
