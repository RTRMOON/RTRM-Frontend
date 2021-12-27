import { useState, useEffect } from 'react'
import { useMarketplaceContract } from '../assets/MarketplaceContract'
import { useWeb3React } from '@web3-react/core'
import nftExample from '../images/nftexample.png'
import { ZERO_ADDRESS } from '../utils'

export const Rarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"]

export const SortOrders = {
  PriceAsc: Symbol("PriceAsc"),
  PriceDesc: Symbol("PriceDesc"),
  RarityAsc: Symbol("RarityAsc"),
  RarityDesc: Symbol("RarityDesc"),
}

export const Filters = {
  Rarity: Symbol("Rarity"),
  NFT: Symbol("NFT"),
  Count: Symbol("Count"),
  Offset: Symbol("Offset"),
}

export function usePurchaseFee() {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [purchaseFee, setPurchaseFee] = useState('0')

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      const fee = await marketplace.getPurchaseFee()
      if (!isCancelled) {
        const percent = fee / 1000
        setPurchaseFee(percent)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return [purchaseFee]
}

export function useListings(sort, filter) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [listings, setListings] = useState([])

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      let data

      // Use filter if any
      if (filter[Filters.Rarity] >= 0) {
        data = await marketplace.getActiveListingsByRarity(filter[Filters.Rarity])
      }
      else {
        data = await marketplace.getActiveListings()
      }

      if (!isCancelled) {
        // Ensure we have only valid listings (contract may return empty listings to fill array length)
        data = data.filter(x => x.seller !== ZERO_ADDRESS)
        
        // Perform sorting per selected sort
        if (sort === SortOrders.PriceAsc) {
          data = [...data].sort((a, b) => a.price - b.price)
        }
        else if (sort === SortOrders.PriceDesc) {
          data = [...data].sort((a, b) => b.price - a.price)
        }
        else if (sort === SortOrders.RarityAsc) {
          data = [...data].sort((a, b) => a.rarity - b.rarity)
        }
        else if (sort === SortOrders.RarityDesc) {
          data = [...data].sort((a, b) => b.rarity - a.rarity)
        }

        // Map to NFT listing elements
        data = data.map(listing => {
          return (
            <div className='nft' key={listing.tokenId + listing.nftAddress} onClick={() => marketplace.purchaseListing(listing.id)}>
              <img src={nftExample} />
              <h3>Staking: 1.5x</h3>
              <h3>Rarity: {Rarities[listing.rarity]}</h3>
              <h3>{library.utils.fromWei(listing.price)} BNB</h3>
            </div>
          )
        })
        
        setListings(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [sort, filter, library, account])
  return [listings]
}