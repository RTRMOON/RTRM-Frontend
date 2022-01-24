import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useNFTStakingContract } from '../assets/NFTStakingContract'
import { useMarketplaceContract } from '../assets/MarketplaceContract'
import { getNftContract } from '../store/contractStore'
import { Rarities } from './useMarketplace'

export function useCanDeposit() {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [deposit, setDeposit] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.canDeposit()
      if (!isCancelled) {
        setDeposit(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return deposit
}

export function useCalculateTotalRewards(updates) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [balance, setBalance] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.calculateTotalRewards(account)
      if (!isCancelled) {
        setBalance(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return balance
}

export function useAPY(rarity, updates) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [apy, setAPY] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const apy = await staking.getAPY(rarity)
      if (!isCancelled) {
        setAPY(apy)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [rarity, updates, library, account])
  return apy
}



export function useTotalBalance(updates) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [balance, setBalance] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getTotalBalance()
      if (!isCancelled) {
        setBalance(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return balance
}

export function useTotalClaimed(updates) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [claimed, setStaked] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getTotalClaimed(account)
      if (!isCancelled) {
        setStaked(library ? library.utils.fromWei(data.toString()) : data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updates, library, account])
  return claimed
}

export function useTotalRarityStaked(rarity, updates) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const [staked, setStaked] = useState('0')
  
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const data = await staking.getTotalRarityStaked(rarity)
      if (!isCancelled) {
        setStaked(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [rarity, updates, library, account])
  return staked
}

export function useNfts(updated, setUpdated) {
  const { account, library } = useWeb3React()
  const staking = useNFTStakingContract()
  const marketplace = useMarketplaceContract()
  const [nfts, setNfts] = useState([])

  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      let ownedNfts = []

      const staked = await staking.getStakedTokens()

      ownedNfts = ownedNfts.concat(await Promise.all(await staked.map(async x => {
        const nftContract = getNftContract(x.nftAddress, library)

        const rarity = await nftContract.methods.rarity().call()
        const name = await nftContract.methods.name().call()
        const apy = await staking.getAPYForToken(x, rarity)
        const rewards = await staking.getRewardsForDeposit(x, rarity);
        const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)
        return {
          tokenId: x.tokenId,
          nftAddress: x.nftAddress,
          rarity: Rarities[rarity],
          apy,
          staked: true,
          rewards,
          media,
          approved: true,
        }
      })))
      const characters = await marketplace.getNftsByPlayer(account)
      for (const character of characters) {        
        const owned = await marketplace.getOwnedTokens(account, character)
        if (owned.length) {
          const nftContract = getNftContract(character, library)

          const rarity = await nftContract.methods.rarity().call()
          const name = await nftContract.methods.name().call()
          const apy = await staking.getAPY(rarity)
          const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)

          const approved = await staking.isApproved(character)
          ownedNfts = ownedNfts.concat(owned.map(x => {
            return {
              tokenId: x,
              nftAddress: character,
              rarity: Rarities[rarity],
              apy,
              staked: false,
              media,
              approved,
            }
          }))
        }
      }

      if (!isCancelled) {
        setNfts(ownedNfts)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [updated, account, library])
  return nfts
}