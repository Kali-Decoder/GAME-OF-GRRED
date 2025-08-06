'use client'

import { FrameProvider } from '@/components/farcaster-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { GameOfGreedProvider } from '@/app/contexts/GameOfGreedContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <FrameProvider>
        <GameOfGreedProvider>
          {children}
        </GameOfGreedProvider>
      </FrameProvider>
    </WalletProvider>
  )
}
