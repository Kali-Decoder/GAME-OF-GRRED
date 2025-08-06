'use client';

import React, { useState } from 'react';
import { useGameOfGreed } from '../app/contexts/GameOfGreedContext';

export const GameExample = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const {
    // === WRITE OPERATIONS ===
    createRoom,
    joinRoom,
    makeDecision,
    forceResolve,
    withdrawContractFunds,
    isCreateRoomLoading,
    isJoinRoomLoading,
    isMakeDecisionLoading,
    isForceResolveLoading,
    isWithdrawLoading,
    createRoomError,
    joinRoomError,
    makeDecisionError,
    forceResolveError,
    withdrawError,
    
    // === READ OPERATIONS ===
    owner,
    roomCounter,
    tokenAddress,
    decisionTimeLimit,
    isOwnerLoading,
    isRoomCounterLoading,
    isTokenLoading,
    isDecisionTimeLoading,
    ownerError,
    roomCounterError,
    tokenError,
    decisionTimeError,
    useRoomDetails,
    
    // Decision enum
    Decision,
  } = useGameOfGreed();

  // Get room details for selected room
  const { room, isLoading: isRoomLoading, error: roomError } = useRoomDetails(selectedRoomId);

  const handleCreateRoom = async () => {
    try {
      await createRoom(stakeAmount);
      console.log('Room creation initiated');
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomId);
      console.log('Join room initiated');
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleMakeDecision = async (decision: typeof Decision[keyof typeof Decision]) => {
    try {
      await makeDecision(roomId, decision);
      console.log('Decision made');
    } catch (error) {
      console.error('Failed to make decision:', error);
    }
  };

  const handleForceResolve = async () => {
    try {
      await forceResolve(roomId);
      console.log('Force resolve initiated');
    } catch (error) {
      console.error('Failed to force resolve:', error);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      await withdrawContractFunds();
      console.log('Withdraw initiated');
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Game of Greed Contract Interface</h1>
      
      {/* Contract State Display */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Contract State</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Owner:</strong> {isOwnerLoading ? 'Loading...' : owner ? String(owner) : 'N/A'}
            {ownerError && <p className="text-red-500 text-sm">{ownerError.message}</p>}
          </div>
          <div>
            <strong>Room Counter:</strong> {isRoomCounterLoading ? 'Loading...' : roomCounter ? String(roomCounter) : 'N/A'}
            {roomCounterError && <p className="text-red-500 text-sm">{roomCounterError.message}</p>}
          </div>
          <div>
            <strong>Token Address:</strong> {isTokenLoading ? 'Loading...' : tokenAddress ? String(tokenAddress) : 'N/A'}
            {tokenError && <p className="text-red-500 text-sm">{tokenError.message}</p>}
          </div>
          <div>
            <strong>Decision Time Limit:</strong> {isDecisionTimeLoading ? 'Loading...' : decisionTimeLimit ? String(decisionTimeLimit) : 'N/A'}
            {decisionTimeError && <p className="text-red-500 text-sm">{decisionTimeError.message}</p>}
          </div>
        </div>
      </div>

      {/* Write Operations */}
      <div className="space-y-6">
        {/* Create Room */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Create Room</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Stake amount (wei)"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleCreateRoom}
              disabled={isCreateRoomLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              {isCreateRoomLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
          {createRoomError && <p className="text-red-500 text-sm mt-2">{createRoomError}</p>}
        </div>

        {/* Join Room */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Join Room</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleJoinRoom}
              disabled={isJoinRoomLoading}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              {isJoinRoomLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
          {joinRoomError && <p className="text-red-500 text-sm mt-2">{joinRoomError}</p>}
        </div>

        {/* Make Decision */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Make Decision</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={() => handleMakeDecision(Decision.COOPERATE)}
              disabled={isMakeDecisionLoading}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:bg-gray-300"
            >
              {isMakeDecisionLoading ? 'Making Decision...' : 'Cooperate'}
            </button>
            <button
              onClick={() => handleMakeDecision(Decision.DEFECT)}
              disabled={isMakeDecisionLoading}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
            >
              {isMakeDecisionLoading ? 'Making Decision...' : 'Defect'}
            </button>
          </div>
          {makeDecisionError && <p className="text-red-500 text-sm mt-2">{makeDecisionError}</p>}
        </div>

        {/* Force Resolve */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Force Resolve</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleForceResolve}
              disabled={isForceResolveLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded disabled:bg-gray-300"
            >
              {isForceResolveLoading ? 'Resolving...' : 'Force Resolve'}
            </button>
          </div>
          {forceResolveError && <p className="text-red-500 text-sm mt-2">{forceResolveError}</p>}
        </div>

        {/* Withdraw Funds */}
        <div className="border p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Withdraw Contract Funds</h3>
          <button
            onClick={handleWithdrawFunds}
            disabled={isWithdrawLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300"
          >
            {isWithdrawLoading ? 'Withdrawing...' : 'Withdraw Funds'}
          </button>
          {withdrawError && <p className="text-red-500 text-sm mt-2">{withdrawError}</p>}
        </div>
      </div>

      {/* Room Details */}
      <div className="mt-6 border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Room Details</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            placeholder="Enter room ID to view details"
            className="flex-1 p-2 border rounded"
          />
        </div>
        {selectedRoomId && (
          <div className="bg-gray-50 p-4 rounded">
            {isRoomLoading ? (
              <p>Loading room details...</p>
            ) : roomError ? (
              <p className="text-red-500">Error loading room: {roomError.message}</p>
            ) : room ? (
              <div className="space-y-2">
                <p><strong>Player 1:</strong> {String(room.player1)}</p>
                <p><strong>Player 2:</strong> {String(room.player2)}</p>
                <p><strong>Stake Amount:</strong> {String(room.stakeAmount)}</p>
                <p><strong>Decision 1:</strong> {String(room.decision1)}</p>
                <p><strong>Decision 2:</strong> {String(room.decision2)}</p>
                <p><strong>Is Finished:</strong> {String(room.isFinished)}</p>
                <p><strong>Start Time:</strong> {String(room.startTime)}</p>
              </div>
            ) : (
              <p>No room data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 