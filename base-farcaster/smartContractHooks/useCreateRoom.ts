import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { gameOfGreedContract } from '../lib/config';

export const useCreateRoom = () => {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data, isError: isWriteError, error: writeError } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess, isError: isTransactionError } = useWaitForTransactionReceipt({
    hash: data,
  });

  const createRoom = async (amount: string) => {
    try {
      console.log('🚀 Creating room with stake amount:', amount);
      setStakeAmount(amount);
      setError(null);
      setIsLoading(true);

      if (!writeContract) {
        throw new Error('Contract write function not available');
      }

      writeContract({
        address: gameOfGreedContract.address as `0x${string}`,
        abi: gameOfGreedContract.abi,
        functionName: 'createRoom',
        args: [BigInt(amount)],
      });
      console.log('✅ Create room transaction initiated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create room';
      console.error('❌ Error creating room:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle transaction success
  if (isSuccess && isLoading) {
    console.log('🎉 Room created successfully!');
    setIsLoading(false);
  }

  // Handle transaction error
  if (isTransactionError && isLoading) {
    console.error('❌ Transaction failed for creating room');
    setError('Transaction failed');
    setIsLoading(false);
  }

  // Handle write error
  if (isWriteError && writeError && !error) {
    console.error('❌ Write error:', writeError);
    setError(writeError.message);
  }

  return {
    createRoom,
    isLoading: isLoading || isTransactionLoading,
    isSuccess,
    error,
    data,
  };
}; 