import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { gameOfGreedContract } from '../lib/config';

export enum Decision {
  COOPERATE = 0,
  DEFECT = 1,
}

export const useMakeDecision = () => {
  const [roomId, setRoomId] = useState<string>('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data, isError: isWriteError, error: writeError } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess, isError: isTransactionError } = useWaitForTransactionReceipt({
    hash: data,
  });

  const makeDecision = async (roomIdParam: string, decisionParam: Decision) => {
    try {
      console.log('🚀 Making decision for room:', roomIdParam, 'Decision:', decisionParam === Decision.COOPERATE ? 'COOPERATE' : 'DEFECT');
      setRoomId(roomIdParam);
      setDecision(decisionParam);
      setError(null);
      setIsLoading(true);

      if (!writeContract) {
        throw new Error('Contract write function not available');
      }

      writeContract({
        address: gameOfGreedContract.address as `0x${string}`,
        abi: gameOfGreedContract.abi,
        functionName: 'makeDecision',
        args: [BigInt(roomIdParam), decisionParam],
      });
      console.log('✅ Make decision transaction initiated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to make decision';
      console.error('❌ Error making decision:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle transaction success
  if (isSuccess && isLoading) {
    console.log('🎉 Decision made successfully!');
    setIsLoading(false);
  }

  // Handle transaction error
  if (isTransactionError && isLoading) {
    console.error('❌ Transaction failed for making decision');
    setError('Transaction failed');
    setIsLoading(false);
  }

  // Handle write error
  if (isWriteError && writeError && !error) {
    console.error('❌ Write error:', writeError);
    setError(writeError.message);
  }

  return {
    makeDecision,
    isLoading: isLoading || isTransactionLoading,
    isSuccess,
    error,
    data,
    Decision,
  };
}; 