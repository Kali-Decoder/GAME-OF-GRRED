import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { gameOfGreedContract } from '../lib/config';

export const useWithdrawContractFunds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContract, data, isError: isWriteError, error: writeError } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess, isError: isTransactionError } = useWaitForTransactionReceipt({
    hash: data,
  });

  const withdrawContractFunds = async () => {
    try {
      console.log('🚀 Withdrawing contract funds...');
      setError(null);
      setIsLoading(true);

      if (!writeContract) {
        throw new Error('Contract write function not available');
      }

      writeContract({
        address: gameOfGreedContract.address as `0x${string}`,
        abi: gameOfGreedContract.abi,
        functionName: 'withdrawContractFunds',
      });
      console.log('✅ Withdraw contract funds transaction initiated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw contract funds';
      console.error('❌ Error withdrawing contract funds:', errorMessage);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle transaction success
  if (isSuccess && isLoading) {
    console.log('🎉 Contract funds withdrawn successfully!');
    setIsLoading(false);
  }

  // Handle transaction error
  if (isTransactionError && isLoading) {
    console.error('❌ Transaction failed for withdrawing contract funds');
    setError('Transaction failed');
    setIsLoading(false);
  }

  // Handle write error
  if (isWriteError && writeError && !error) {
    console.error('❌ Write error:', writeError);
    setError(writeError.message);
  }

  return {
    withdrawContractFunds,
    isLoading: isLoading || isTransactionLoading,
    isSuccess,
    error,
    data,
  };
}; 