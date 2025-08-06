import { useReadContract } from 'wagmi';
import { gameOfGreedContract } from '../lib/config';

export const useGameOfGreedRead = () => {
  // Read owner
  const { data: owner, isLoading: isOwnerLoading, error: ownerError } = useReadContract({
    address: gameOfGreedContract.address as `0x${string}`,
    abi: gameOfGreedContract.abi,
    functionName: 'owner',
  });

  // Read room counter
  const { data: roomCounter, isLoading: isRoomCounterLoading, error: roomCounterError } = useReadContract({
    address: gameOfGreedContract.address as `0x${string}`,
    abi: gameOfGreedContract.abi,
    functionName: 'roomCounter',
  });

  // Read token address
  const { data: tokenAddress, isLoading: isTokenLoading, error: tokenError } = useReadContract({
    address: gameOfGreedContract.address as `0x${string}`,
    abi: gameOfGreedContract.abi,
    functionName: 'token',
  });

  // Read decision time limit
  const { data: decisionTimeLimit, isLoading: isDecisionTimeLoading, error: decisionTimeError } = useReadContract({
    address: gameOfGreedContract.address as `0x${string}`,
    abi: gameOfGreedContract.abi,
    functionName: 'DECISION_TIME_LIMIT',
  });

  // Function to read specific room
  const useRoomDetails = (roomId: string) => {
    const { data: room, isLoading: isRoomLoading, error: roomError } = useReadContract({
      address: gameOfGreedContract.address as `0x${string}`,
      abi: gameOfGreedContract.abi,
      functionName: 'rooms',
      args: roomId ? [BigInt(roomId)] : undefined,
      enabled: !!roomId,
    });

    return {
      room,
      isLoading: isRoomLoading,
      error: roomError,
    };
  };

  return {
    // Contract state
    owner,
    roomCounter,
    tokenAddress,
    decisionTimeLimit,
    
    // Loading states
    isOwnerLoading,
    isRoomCounterLoading,
    isTokenLoading,
    isDecisionTimeLoading,
    
    // Errors
    ownerError,
    roomCounterError,
    tokenError,
    decisionTimeError,
    
    // Room details hook
    useRoomDetails,
  };
}; 