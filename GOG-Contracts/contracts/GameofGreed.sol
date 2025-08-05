// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameOfGreed {
    enum Decision { NONE, STEAL, SPLIT }

    struct Room {
        address player1;
        address player2;
        uint256 stakeAmount; 
        Decision decision1;
        Decision decision2;
        bool isFinished;
        uint256 startTime; 
    }

    IERC20 public immutable token; 
    address public owner;
    uint256 public roomCounter;
    mapping(uint256 => Room) public rooms;

    uint256 public constant DECISION_TIME_LIMIT = 10 minutes;

    event RoomCreated(uint256 indexed roomId, address indexed creator, uint256 stakeAmount);
    event PlayerJoined(uint256 indexed roomId, address indexed player);
    event DecisionMade(uint256 indexed roomId, address indexed player, Decision decision);
    event GameResolved(uint256 indexed roomId, string outcome);

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    modifier onlyPlayer(uint256 _roomId) {
        require(
            msg.sender == rooms[_roomId].player1 || msg.sender == rooms[_roomId].player2,
            "Not a player in this room"
        );
        _;
    }

    function createRoom(uint256 _stakeAmount) external returns (uint256) {
        require(_stakeAmount > 0, "Stake must be > 0");
        require(
            token.transferFrom(msg.sender, address(this), _stakeAmount),
            "Token transfer failed"
        );

        roomCounter++;
        rooms[roomCounter] = Room({
            player1: msg.sender,
            player2: address(0),
            stakeAmount: _stakeAmount,
            decision1: Decision.NONE,
            decision2: Decision.NONE,
            isFinished: false,
            startTime: 0
        });

        emit RoomCreated(roomCounter, msg.sender, _stakeAmount);
        return roomCounter;
    }

    function joinRoom(uint256 _roomId) external {
        Room storage room = rooms[_roomId];
        require(room.player2 == address(0), "Room full");
        require(msg.sender != room.player1, "Can't join own room");

        // Must match stake amount exactly
        require(
            token.transferFrom(msg.sender, address(this), room.stakeAmount),
            "Token transfer failed"
        );

        room.player2 = msg.sender;
        room.startTime = block.timestamp; // Start 10-min timer
        emit PlayerJoined(_roomId, msg.sender);
    }

    function makeDecision(uint256 _roomId, Decision _decision) external onlyPlayer(_roomId) {
        Room storage room = rooms[_roomId];
        require(!room.isFinished, "Game finished");
        require(room.startTime > 0, "Game hasn't started");
        require(block.timestamp <= room.startTime + DECISION_TIME_LIMIT, "Decision time expired");
        require(_decision == Decision.STEAL || _decision == Decision.SPLIT, "Invalid decision");

        if (msg.sender == room.player1) {
            require(room.decision1 == Decision.NONE, "Already decided");
            room.decision1 = _decision;
        } else {
            require(room.decision2 == Decision.NONE, "Already decided");
            room.decision2 = _decision;
        }

        emit DecisionMade(_roomId, msg.sender, _decision);

        if (room.decision1 != Decision.NONE && room.decision2 != Decision.NONE) {
            _resolveGame(_roomId);
        }
    }

    function forceResolve(uint256 _roomId) external {
        Room storage room = rooms[_roomId];
        require(!room.isFinished, "Game finished");
        require(room.startTime > 0, "Game hasn't started");
        require(block.timestamp > room.startTime + DECISION_TIME_LIMIT, "Too early");

        // If one or both didn't decide → lock funds in contract
        if (room.decision1 == Decision.NONE || room.decision2 == Decision.NONE) {
            room.isFinished = true;
            emit GameResolved(_roomId, "Time expired: Funds locked in contract");
            return;
        }

        _resolveGame(_roomId);
    }

    function _resolveGame(uint256 _roomId) internal {
        Room storage room = rooms[_roomId];
        uint256 totalAmount = room.stakeAmount * 2;
        room.isFinished = true;

        // Split / Split
        if (room.decision1 == Decision.SPLIT && room.decision2 == Decision.SPLIT) {
            token.transfer(room.player1, room.stakeAmount);
            token.transfer(room.player2, room.stakeAmount);
            emit GameResolved(_roomId, "Split / Split: Equal split");
        }
        // Steal / Split
        else if (room.decision1 == Decision.STEAL && room.decision2 == Decision.SPLIT) {
            token.transfer(room.player1, totalAmount);
            emit GameResolved(_roomId, "Steal / Split: Player1 takes all");
        }
        // Split / Steal
        else if (room.decision1 == Decision.SPLIT && room.decision2 == Decision.STEAL) {
            token.transfer(room.player2, totalAmount);
            emit GameResolved(_roomId, "Split / Steal: Player2 takes all");
        }
        // Steal / Steal → locked in contract
        else if (room.decision1 == Decision.STEAL && room.decision2 == Decision.STEAL) {
            emit GameResolved(_roomId, "Steal / Steal: Funds locked in contract");
        }
    }

    function withdrawContractFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        token.transfer(owner, token.balanceOf(address(this)));
    }
}
