import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { gameOfGreedContract } from '../lib/config';

export const useJoinRoom = () => {
  const [roomId, setRoomId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data, isError: isWriteError, error: writeError } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess, isError: isTransactionError } = useWaitForTransactionReceipt({
    hash: data,
  });

  const joinRoom = async (roomIdParam: string) => {
    try {
      console.log('🚀 Joining room with ID:', roomIdParam);
      setRoomId(roomIdParam);
      setError(null);
      setIsLoading(true);

      if (!writeContract) {
        throw new Error('Contract write function not available');
      }

      writeContract({
        address: gameOfGreedContract.address as `0x${string}`,
        abi: gameOfGreedContract.abi,
        functionName: 'joinRoom',
        args: [BigInt(roomIdParam)],
      });
      console.log('✅ Join room transaction initiated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room';
      console.error('❌ Error joining room:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle transaction success
  if (isSuccess && isLoading) {
    console.log('🎉 Successfully joined room!');
    setIsLoading(false);
  }

  // Handle transaction error
  if (isTransactionError && isLoading) {
    console.error('❌ Transaction failed for joining room');
    setError('Transaction failed');
    setIsLoading(false);
  }

  // Handle write error
  if (isWriteError && writeError && !error) {
    console.error('❌ Write error:', writeError);
    setError(writeError.message);
  }

  return {
    joinRoom,
    isLoading: isLoading || isTransactionLoading,
    isSuccess,
    error,
    data,
  };
}; 