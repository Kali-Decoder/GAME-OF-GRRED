# Smart Contract Hooks

This directory contains React hooks for interacting with the Game of Greed smart contract. All hooks include proper error handling, loading states, and console logging for debugging.

## Available Hooks

### 1. `useCreateRoom`
Creates a new game room with a specified stake amount.

```typescript
import { useCreateRoom } from './smartContractHooks';

const { createRoom, isLoading, isSuccess, error } = useCreateRoom();

// Usage
await createRoom("1000000000000000000"); // 1 ETH in wei
```

**Returns:**
- `createRoom(amount: string)` - Function to create a room
- `isLoading` - Boolean indicating if transaction is pending
- `isSuccess` - Boolean indicating if transaction was successful
- `error` - Error message if transaction failed
- `data` - Transaction data

### 2. `useJoinRoom`
Joins an existing game room.

```typescript
import { useJoinRoom } from './smartContractHooks';

const { joinRoom, isLoading, isSuccess, error } = useJoinRoom();

// Usage
await joinRoom("1"); // Join room with ID 1
```

**Returns:**
- `joinRoom(roomId: string)` - Function to join a room
- `isLoading` - Boolean indicating if transaction is pending
- `isSuccess` - Boolean indicating if transaction was successful
- `error` - Error message if transaction failed
- `data` - Transaction data

### 3. `useMakeDecision`
Makes a decision in the game (Cooperate or Defect).

```typescript
import { useMakeDecision, Decision } from './smartContractHooks';

const { makeDecision, isLoading, isSuccess, error, Decision } = useMakeDecision();

// Usage
await makeDecision("1", Decision.COOPERATE); // Cooperate in room 1
await makeDecision("1", Decision.DEFECT);    // Defect in room 1
```

**Returns:**
- `makeDecision(roomId: string, decision: Decision)` - Function to make a decision
- `isLoading` - Boolean indicating if transaction is pending
- `isSuccess` - Boolean indicating if transaction was successful
- `error` - Error message if transaction failed
- `data` - Transaction data
- `Decision` - Enum with COOPERATE = 0, DEFECT = 1

### 4. `useForceResolve`
Force resolves a game room (admin function).

```typescript
import { useForceResolve } from './smartContractHooks';

const { forceResolve, isLoading, isSuccess, error } = useForceResolve();

// Usage
await forceResolve("1"); // Force resolve room 1
```

**Returns:**
- `forceResolve(roomId: string)` - Function to force resolve a room
- `isLoading` - Boolean indicating if transaction is pending
- `isSuccess` - Boolean indicating if transaction was successful
- `error` - Error message if transaction failed
- `data` - Transaction data

### 5. `useWithdrawContractFunds`
Withdraws contract funds (admin function).

```typescript
import { useWithdrawContractFunds } from './smartContractHooks';

const { withdrawContractFunds, isLoading, isSuccess, error } = useWithdrawContractFunds();

// Usage
await withdrawContractFunds();
```

**Returns:**
- `withdrawContractFunds()` - Function to withdraw contract funds
- `isLoading` - Boolean indicating if transaction is pending
- `isSuccess` - Boolean indicating if transaction was successful
- `error` - Error message if transaction failed
- `data` - Transaction data

## Using with Context

You can also use all hooks through the `GameOfGreedContext`:

```typescript
import { useGameOfGreed } from '../app/contexts/GameOfGreedContext';

const {
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
  Decision,
} = useGameOfGreed();

// Usage
await createRoom("1000000000000000000");
await joinRoom("1");
await makeDecision("1", Decision.COOPERATE);
```

## Console Logging

All hooks include comprehensive console logging:

- 🚀 - Transaction initiated
- ✅ - Transaction submitted
- 🎉 - Transaction successful
- ❌ - Transaction failed or error occurred

## Error Handling

All hooks include proper error handling:
- Contract write errors
- Transaction errors
- User input validation
- Network errors

## Example Usage in Component

```typescript
import React, { useState } from 'react';
import { useGameOfGreed } from '../app/contexts/GameOfGreedContext';

const GameComponent = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [roomId, setRoomId] = useState('');
  
  const {
    createRoom,
    joinRoom,
    makeDecision,
    isCreateRoomLoading,
    isJoinRoomLoading,
    isMakeDecisionLoading,
    createRoomError,
    joinRoomError,
    makeDecisionError,
    Decision,
  } = useGameOfGreed();

  const handleCreateRoom = async () => {
    try {
      await createRoom(stakeAmount);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleMakeDecision = async (decision: Decision) => {
    try {
      await makeDecision(roomId, decision);
    } catch (error) {
      console.error('Failed to make decision:', error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
          placeholder="Stake amount (wei)"
        />
        <button onClick={handleCreateRoom} disabled={isCreateRoomLoading}>
          {isCreateRoomLoading ? 'Creating...' : 'Create Room'}
        </button>
        {createRoomError && <p style={{ color: 'red' }}>{createRoomError}</p>}
      </div>

      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <button onClick={handleJoinRoom} disabled={isJoinRoomLoading}>
          {isJoinRoomLoading ? 'Joining...' : 'Join Room'}
        </button>
        {joinRoomError && <p style={{ color: 'red' }}>{joinRoomError}</p>}
      </div>

      <div>
        <button 
          onClick={() => handleMakeDecision(Decision.COOPERATE)}
          disabled={isMakeDecisionLoading}
        >
          {isMakeDecisionLoading ? 'Making Decision...' : 'Cooperate'}
        </button>
        <button 
          onClick={() => handleMakeDecision(Decision.DEFECT)}
          disabled={isMakeDecisionLoading}
        >
          {isMakeDecisionLoading ? 'Making Decision...' : 'Defect'}
        </button>
        {makeDecisionError && <p style={{ color: 'red' }}>{makeDecisionError}</p>}
      </div>
    </div>
  );
};

export default GameComponent;
```

## Setup

The `GameOfGreedProvider` is already integrated into your app's provider chain in `components/providers.tsx`. This means all components in your app can access the Game of Greed context.

### Provider Chain:
```typescript
// components/providers.tsx
<WalletProvider>
  <FrameProvider>
    <GameOfGreedProvider>
      {children}
    </GameOfGreedProvider>
  </FrameProvider>
</WalletProvider>
```

### Usage in Any Component:
```typescript
import { useGameOfGreed } from '../app/contexts/GameOfGreedContext';

const MyComponent = () => {
  const {
    // Write operations
    createRoom,
    joinRoom,
    makeDecision,
    forceResolve,
    withdrawContractFunds,
    
    // Read operations
    owner,
    roomCounter,
    tokenAddress,
    decisionTimeLimit,
    useRoomDetails,
    
    // Loading states
    isCreateRoomLoading,
    isJoinRoomLoading,
    isMakeDecisionLoading,
    isForceResolveLoading,
    isWithdrawLoading,
    isOwnerLoading,
    isRoomCounterLoading,
    isTokenLoading,
    isDecisionTimeLoading,
    
    // Errors
    createRoomError,
    joinRoomError,
    makeDecisionError,
    forceResolveError,
    withdrawError,
    ownerError,
    roomCounterError,
    tokenError,
    decisionTimeError,
    
    // Decision enum
    Decision,
  } = useGameOfGreed();

  // Use any of these functions and states
};
``` 