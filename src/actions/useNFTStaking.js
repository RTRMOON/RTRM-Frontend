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
      const data = await staking.getAPY(rarity)
      if (!isCancelled) {
        setAPY(data)
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

export function useOwnedNfts(updated, setUpdated) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const staking = useNFTStakingContract()
  const [nfts, setNfts] = useState([])


  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      const ownedNfts = []
      const characters = await staking.getNFTAddresses()
      for (const character of characters) {
        const nftContract = getNftContract(character, library)

        const rarity = await nftContract.methods.rarity().call()
        const name = await nftContract.methods.name().call()
        const apy = await staking.getAPY(rarity)
        const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)

        const approved = await staking.isApproved(character)
        function approveForStaking(nft) {
          // TODO: disable button
          staking.approveContract(character).then(() => {
            setUpdated(updated + 1)
          })
          .finally(() => {
            // TODO: enable button
          })
        }
        function stake(nft, id) {
          // TODO: disable button
          staking.stake(nft, id).then(() => {
            setUpdated(updated + 1)
          })
          .finally(() => {
            // TODO: enable button
          })
        }
        function unstake(nft, id) {
          // TODO: disable button
          staking.unstake(nft, id).then(() => {
            setUpdated(updated + 1)
          })
          .finally(() => {
            // TODO: enable button
          })
        }
        const staked = await staking.getStakedTokens(character)
        const owned = await marketplace.getOwnedTokens(account, character)
        const stakedtokens = staked.map(x => {
          return (
            <div className='nft nftBuyBox' key={x + character}>
              <video src={media} width="180" height="248" autoPlay loop muted controls='' />
              <h3>Token ID: {x}</h3>
              <h3>Rarity: {Rarities[rarity]}</h3>
              <h3>APY: {Math.round(apy)}%</h3>
              <button onClick={() => unstake(character, x)}>Unstake</button>
            </div>
          )
          
        })
        const tokens = owned.map(x => {
          return (
            <div className='nft nftBuyBox' key={x + character}>
              <video src={media} width="180" height="248" autoPlay loop muted controls='' />
              <h3>Token ID: {x}</h3>
              <h3>Rarity: {Rarities[rarity]}</h3>
              <h3>APY: {Math.round(apy)}%</h3>
              {
                approved ?
                <button onClick={() => stake(character, x)}>Stake</button> :
                <button onClick={() => approveForStaking(character)}>Approve</button>
              }
            </div>
          )
        })

        ownedNfts.push(...stakedtokens, ...tokens)
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