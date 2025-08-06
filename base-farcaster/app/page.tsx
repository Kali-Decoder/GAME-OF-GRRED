'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector';
import { useGameOfGreed } from './contexts/GameOfGreedContext';
import { useFrame } from '@/components/farcaster-provider';
import { useState, useEffect } from 'react';

export default function Home() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Wallet hooks
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Fix hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Farcaster hooks
  const { context, isLoading: isFrameLoading } = useFrame();

  // Game of Greed hooks
  const {
    // Write operations
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

    // Read operations
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

  // Get room details
  const { room, isLoading: isRoomLoading, error: roomError } = useRoomDetails(selectedRoomId);

  const handleCreateRoom = async () => {
    if (!stakeAmount) return;
    try {
      await createRoom(stakeAmount);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId) return;
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleMakeDecision = async (decision: typeof Decision[keyof typeof Decision]) => {
    if (!roomId) return;
    try {
      await makeDecision(roomId, decision);
    } catch (error) {
      console.error('Failed to make decision:', error);
    }
  };

  const handleForceResolve = async () => {
    if (!roomId) return;
    try {
      await forceResolve(roomId);
    } catch (error) {
      console.error('Failed to force resolve:', error);
    }
  };

  const handleWithdrawFunds = async () => {
    try {
      await withdrawContractFunds();
    } catch (error) {
      console.error('Failed to withdraw funds:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">🎮 Game of Greed Test App</h1>

        {/* Wallet Connection */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black">🔗 Wallet Connection</h2>
          <div className="flex items-center gap-4">
            {!isClient ? (
              <div className="flex-1">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : isConnected ? (
              <>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Connected Address:</p>
                  <p className="font-mono text-sm break-all text-black">{address}</p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-gray-600">Not connected</p>
                </div>
                <button
                  onClick={() => connect({ connector: miniAppConnector() })}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Farcaster Context */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black">📱 Farcaster Context</h2>
          <div className="space-y-2 text-black">
            <p><strong>Frame Loading:</strong> {isFrameLoading ? 'Loading...' : 'Ready'}</p>
            <p><strong>Context:</strong> {context ? 'Available' : 'Not available'}</p>
            {context && (
              <div className="text-sm text-gray-600">
                <p>User: {context.user?.displayName || 'Unknown'}</p>
                <p>FID: {context.user?.fid || 'Unknown'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contract State */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black">📊 Contract State</h2>
          <div className="grid grid-cols-2 gap-4 text-black">
            <div>
              <strong>Owner:</strong> 
              {isOwnerLoading ? ' Loading...' : owner ? ` ${String(owner).slice(0, 10)}...` : ' N/A'}
              {ownerError && <p className="text-red-500 text-xs">{ownerError.message}</p>}
            </div>
            <div>
              <strong>Room Counter:</strong> 
              {isRoomCounterLoading ? ' Loading...' : roomCounter ? ` ${String(roomCounter)}` : ' N/A'}
              {roomCounterError && <p className="text-red-500 text-xs">{roomCounterError.message}</p>}
            </div>
            <div>
              <strong>Token Address:</strong> 
              {isTokenLoading ? ' Loading...' : tokenAddress ? ` ${String(tokenAddress).slice(0, 10)}...` : ' N/A'}
              {tokenError && <p className="text-red-500 text-xs">{tokenError.message}</p>}
            </div>
            <div>
              <strong>Decision Time Limit:</strong> 
              {isDecisionTimeLoading ? ' Loading...' : decisionTimeLimit ? ` ${String(decisionTimeLimit)}` : ' N/A'}
              {decisionTimeError && <p className="text-red-500 text-xs">{decisionTimeError.message}</p>}
            </div>
          </div>
        </div>

        {/* Write Operations */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black">✍️ Write Operations</h2>
          
          {/* Create Room */}
          <div className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2 text-black">Create Room</h3>
            <div className="flex gap-2">
                              <input
                  type="text"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Stake amount (wei)"
                  className="flex-1 p-2 border rounded text-black"
                />
              <button
                onClick={handleCreateRoom}
                disabled={isCreateRoomLoading || !isConnected}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              >
                {isCreateRoomLoading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
            {createRoomError && <p className="text-red-500 text-sm mt-2">{createRoomError}</p>}
          </div>

          {/* Join Room */}
          <div className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2 text-black">Join Room</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
                className="flex-1 p-2 border rounded text-black"
              />
              <button
                onClick={handleJoinRoom}
                disabled={isJoinRoomLoading || !isConnected}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                {isJoinRoomLoading ? 'Joining...' : 'Join Room'}
              </button>
            </div>
            {joinRoomError && <p className="text-red-500 text-sm mt-2">{joinRoomError}</p>}
          </div>

          {/* Make Decision */}
          <div className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2 text-black">Make Decision</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
                className="flex-1 p-2 border rounded text-black"
              />
              <button
                onClick={() => handleMakeDecision(Decision.COOPERATE)}
                disabled={isMakeDecisionLoading || !isConnected}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-300"
              >
                {isMakeDecisionLoading ? 'Making Decision...' : 'Cooperate'}
              </button>
              <button
                onClick={() => handleMakeDecision(Decision.DEFECT)}
                disabled={isMakeDecisionLoading || !isConnected}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
              >
                {isMakeDecisionLoading ? 'Making Decision...' : 'Defect'}
              </button>
            </div>
            {makeDecisionError && <p className="text-red-500 text-sm mt-2">{makeDecisionError}</p>}
          </div>

          {/* Force Resolve */}
          <div className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2 text-black">Force Resolve</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Room ID"
                className="flex-1 p-2 border rounded text-black"
              />
              <button
                onClick={handleForceResolve}
                disabled={isForceResolveLoading || !isConnected}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300"
              >
                {isForceResolveLoading ? 'Resolving...' : 'Force Resolve'}
              </button>
            </div>
            {forceResolveError && <p className="text-red-500 text-sm mt-2">{forceResolveError}</p>}
          </div>

          {/* Withdraw Funds */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-2 text-black">Withdraw Contract Funds</h3>
            <button
              onClick={handleWithdrawFunds}
              disabled={isWithdrawLoading || !isConnected}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300"
            >
              {isWithdrawLoading ? 'Withdrawing...' : 'Withdraw Funds'}
            </button>
            {withdrawError && <p className="text-red-500 text-sm mt-2">{withdrawError}</p>}
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-black">🏠 Room Details</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              placeholder="Enter room ID to view details"
              className="flex-1 p-2 border rounded text-black"
            />
          </div>
          {selectedRoomId && (
            <div className="bg-gray-50 p-4 rounded">
              {isRoomLoading ? (
                <p>Loading room details...</p>
              ) : roomError ? (
                <p className="text-red-500">Error loading room: {roomError.message}</p>
              ) : room ? (
                <div className="space-y-2 text-sm text-black">
                  <p><strong>Room Data:</strong> {JSON.stringify(room, (key, value) => 
                    typeof value === 'bigint' ? value.toString() : value, 2)}</p>
                  <p><strong>Player 1:</strong> {String(room.player1 || 'N/A')}</p>
                  <p><strong>Player 2:</strong> {String(room.player2 || 'N/A')}</p>
                  <p><strong>Stake Amount:</strong> {String(room.stakeAmount || 'N/A')}</p>
                  <p><strong>Decision 1:</strong> {String(room.decision1 || 'N/A')}</p>
                  <p><strong>Decision 2:</strong> {String(room.decision2 || 'N/A')}</p>
                  <p><strong>Is Finished:</strong> {String(room.isFinished || 'N/A')}</p>
                  <p><strong>Start Time:</strong> {String(room.startTime || 'N/A')}</p>
                </div>
              ) : (
                <p>No room data available</p>
              )}
            </div>
          )}
        </div>

        {/* Console Logs */}
        <div className="mt-6 bg-black text-green-400 p-4 rounded font-mono text-sm">
          <h3 className="text-white mb-2">📝 Console Logs</h3>
          <p>Check browser console for detailed transaction logs</p>
        </div>
      </div>
    </div>
  );
}
