'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useCreateRoom,
  useJoinRoom,
  useMakeDecision,
  useForceResolve,
  useWithdrawContractFunds,
  useGameOfGreedRead,
  Decision,
} from '../../smartContractHooks';

interface GameOfGreedContextType {
  // === WRITE OPERATIONS ===
  // Create Room
  createRoom: (amount: string) => Promise<void>;
  isCreateRoomLoading: boolean;
  isCreateRoomSuccess: boolean;
  createRoomError: string | null;
  
  // Join Room
  joinRoom: (roomId: string) => Promise<void>;
  isJoinRoomLoading: boolean;
  isJoinRoomSuccess: boolean;
  joinRoomError: string | null;
  
  // Make Decision
  makeDecision: (roomId: string, decision: Decision) => Promise<void>;
  isMakeDecisionLoading: boolean;
  isMakeDecisionSuccess: boolean;
  makeDecisionError: string | null;
  
  // Force Resolve
  forceResolve: (roomId: string) => Promise<void>;
  isForceResolveLoading: boolean;
  isForceResolveSuccess: boolean;
  forceResolveError: string | null;
  
  // Withdraw Contract Funds
  withdrawContractFunds: () => Promise<void>;
  isWithdrawLoading: boolean;
  isWithdrawSuccess: boolean;
  withdrawError: string | null;
  
  // === READ OPERATIONS ===
  // Contract state
  owner: unknown;
  roomCounter: unknown;
  tokenAddress: unknown;
  decisionTimeLimit: unknown;
  
  // Read loading states
  isOwnerLoading: boolean;
  isRoomCounterLoading: boolean;
  isTokenLoading: boolean;
  isDecisionTimeLoading: boolean;
  
  // Read errors
  ownerError: Error | null;
  roomCounterError: Error | null;
  tokenError: Error | null;
  decisionTimeError: Error | null;
  
  // Room details function
  useRoomDetails: (roomId: string) => {
    room: any;
    isLoading: boolean;
    error: Error | null;
  };
  
  // Decision enum
  Decision: typeof Decision;
}

const GameOfGreedContext = createContext<GameOfGreedContextType | undefined>(undefined);

export const useGameOfGreed = () => {
  const context = useContext(GameOfGreedContext);
  if (!context) {
    throw new Error('useGameOfGreed must be used within a GameOfGreedProvider');
  }
  return context;
};

interface GameOfGreedProviderProps {
  children: ReactNode;
}

export const GameOfGreedProvider: React.FC<GameOfGreedProviderProps> = ({ children }) => {
  // Initialize write hooks
  const {
    createRoom,
    isLoading: isCreateRoomLoading,
    isSuccess: isCreateRoomSuccess,
    error: createRoomError,
  } = useCreateRoom();

  const {
    joinRoom,
    isLoading: isJoinRoomLoading,
    isSuccess: isJoinRoomSuccess,
    error: joinRoomError,
  } = useJoinRoom();

  const {
    makeDecision,
    isLoading: isMakeDecisionLoading,
    isSuccess: isMakeDecisionSuccess,
    error: makeDecisionError,
  } = useMakeDecision();

  const {
    forceResolve,
    isLoading: isForceResolveLoading,
    isSuccess: isForceResolveSuccess,
    error: forceResolveError,
  } = useForceResolve();

  const {
    withdrawContractFunds,
    isLoading: isWithdrawLoading,
    isSuccess: isWithdrawSuccess,
    error: withdrawError,
  } = useWithdrawContractFunds();

  // Initialize read hooks
  const {
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
  } = useGameOfGreedRead();

  const value: GameOfGreedContextType = {
    // === WRITE OPERATIONS ===
    // Create Room
    createRoom,
    isCreateRoomLoading,
    isCreateRoomSuccess,
    createRoomError,
    
    // Join Room
    joinRoom,
    isJoinRoomLoading,
    isJoinRoomSuccess,
    joinRoomError,
    
    // Make Decision
    makeDecision,
    isMakeDecisionLoading,
    isMakeDecisionSuccess,
    makeDecisionError,
    
    // Force Resolve
    forceResolve,
    isForceResolveLoading,
    isForceResolveSuccess,
    forceResolveError,
    
    // Withdraw Contract Funds
    withdrawContractFunds,
    isWithdrawLoading,
    isWithdrawSuccess,
    withdrawError,
    
    // === READ OPERATIONS ===
    // Contract state
    owner,
    roomCounter,
    tokenAddress,
    decisionTimeLimit,
    
    // Read loading states
    isOwnerLoading,
    isRoomCounterLoading,
    isTokenLoading,
    isDecisionTimeLoading,
    
    // Read errors
    ownerError,
    roomCounterError,
    tokenError,
    decisionTimeError,
    
    // Room details function
    useRoomDetails,
    
    // Decision enum
    Decision,
  };

  return (
    <GameOfGreedContext.Provider value={value}>
      {children}
    </GameOfGreedContext.Provider>
  );
};
