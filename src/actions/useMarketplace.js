import React, { useState, useEffect } from 'react'
import { useMarketplaceContract } from '../assets/MarketplaceContract'
import { useWeb3React } from '@web3-react/core'
import { ZERO_ADDRESS } from '../utils'
import { getNftContract } from '../store/contractStore'

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

export function useOwnedNfts(updated, setUpdated) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [nfts, setNfts] = useState([])
  const [price, setPrice] = useState({})
  const [approving, setApproving] = useState({})
  const [creating, setCreating] = useState({})


  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      const ownedNfts = []
      const characters = await marketplace.getNftsByPlayer(account)
      for (const character of characters) {
        const nftContract = getNftContract(character, library)
        const approved = await marketplace.isApproved(character)

        function approveForListing(character) {
          setApproving({...approving, [character]: true})
          marketplace.approveContract(character)
          .then(receipt => {
            setUpdated(updated + 1)
          })
          .finally(() => {
            setApproving({...approving, [character]: false})
          })
        }

        function createListing(tokenId) {
          setCreating({...creating, [tokenId+character]: true})
          const wei = library.utils.toWei(price[tokenId+character].toString())
          marketplace.createListing(character, tokenId, wei)
          .then(receipt => {
            setUpdated(updated + 1)
          })
          .finally(() => {
            setCreating({...creating, [tokenId+character]: false})
          })
        }
        
        const owned = await marketplace.getOwnedTokens(account, character)
        const tokens = await Promise.all(owned.map(async x => {
          const rarity = await nftContract.methods.rarity().call()
          const name = await nftContract.methods.name().call()
          const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)

          return (

            <div
            className='nft sellNFT' key={x + character}            >
              <video src={media} width="180" height="248" autoPlay loop muted controls='' />
              <h3>Token ID: {x}</h3>
              <h3>Rarity: {Rarities[rarity]}</h3>
              {approved ?
              <>
              <form>
              <input type="number" min="0" name="sellPrice" placeholder='Input price in BNB' value={price[x+character]}
              onChange={(e) => setPrice({...price, [x+character]: e.target.value})}
              
              />
              </form>
              <button onClick={() => createListing(x)} disabled={creating[x+character] || !approved || (!price[x+character] && price[x+character] !== 0)}>
                Sell NFT
              </button>
              </>  :
              <button onClick={() => approveForListing(character)} disabled={approved || approving[character]}>Approve</button>
              
            }

            </div>

          )
        }))

        ownedNfts.push(...tokens)
      }
      
      if (!isCancelled) {
        setNfts(ownedNfts)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [price, creating, approving, updated, account, library])
  return nfts
}

export function useListings(updated, setUpdated, sort, filter) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [listings, setListings] = useState([])
  const [purchasing, setPurchasing] = useState({})
  useEffect(() => {
    let isCancelled = false;
    

    (async () => {
      let data

      // Use filter if any
      if (filter && filter[Filters.Rarity] >= 0) {
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
        data = await Promise.all(data.map(async listing => {
          function purchaseListing() {
            setPurchasing({...purchasing, [listing.id]: true})
            marketplace.purchaseListing(listing.id)
            .then(receipt => {
              setUpdated(updated + 1)
            })
            .finally(() => {
              setPurchasing({...purchasing, [listing.id]: false})
            })
          }
          const nftContract = getNftContract(listing.nftAddress, library)
          const name = await nftContract.methods.name().call()
          const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)
          return (
            <div className='nft nftBuyBox'
            key={listing.tokenId + listing.nftAddress}
            >
              <video className='NFTvideo' src={media} width="180" height="248" autoPlay loop muted controls=''/>
              <h3>Token ID: {listing.tokenId}</h3>
              <h3>Rarity: {Rarities[listing.rarity]}</h3>
              <h3>Price: <a className='NFTprice'>{library.utils.fromWei(listing.price)} BNB</a></h3>
              <button onClick={purchaseListing} disabled={purchasing[listing.id]}>Buy NFT</button>
            </div>
          )
        }))
        
        setListings(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [purchasing, updated, sort, filter, library, account])
  return [listings]
}

export function useOwnedListings(updated, setUpdated) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [listings, setListings] = useState([])
  const [updating, setUpdating] = useState({})
  const [removing, setRemoving] = useState({})
  const [price, setPrice] = useState({})

  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      let data = await marketplace.getSellerListings(account)

      if (!isCancelled) {
        // Ensure we have only valid listings (contract may return empty listings to fill array length)
        data = data.filter(x => x.seller !== ZERO_ADDRESS)

        // Map to NFT listing elements
        data = await Promise.all(data.map(async listing => {
          function updateListing() {
            setUpdating({...updating, [listing.id]: true})
            marketplace.updateListing(listing.id, library.utils.toWei(price[listing.id].toString()))
            .then(receipt => {
              setUpdated(updated + 1)
            })
            .finally(() => {
              setUpdating({...updating, [listing.id]: false})
            })
          }

          function removeListing() {
            setRemoving({...removing, [listing.id]: true})
            marketplace.removeListing(listing.id)
            .then(receipt => {
              setUpdated(updated + 1)
            })
            .finally(() => {
              setRemoving({...removing, [listing.id]: false})
            })
          }
          const nftContract = getNftContract(listing.nftAddress, library)
          const name = await nftContract.methods.name().call()
          const { default: media } = await import(`../images/nfts/${name.toLowerCase().replace(/[^a-z]/gi, '').trim()}.mp4`)
          return (
            <div className='nft sellNFT'
            key={listing.tokenId + listing.nftAddress}
            >
              <video className='NFTvideo' src={media} width="180" height="248" autoPlay loop muted controls=''/>
              <h3>Token ID: {listing.tokenId}</h3>
              <h3>Rarity: {Rarities[listing.rarity]}</h3>
              <h3>Price: <a className='NFTprice'>{library.utils.fromWei(listing.price)} BNB</a></h3>
              <form>
              <input type="number" min="0" defaultValue={library.utils.fromWei(listing.price)}
                value={price[listing.id]} name="sellPrice" placeholder='Input price in BNB'
                onChange={(e) => setPrice({...price, [listing.id]: e.target.value})}
              />
              </form>
              <button onClick={updateListing} disabled={updating[listing.id] || (!price[listing.id] && price[listing.id] !== 0)}>Update</button>
              <button onClick={removeListing} disabled={removing[listing.id]}>Remove</button>
            </div>
          )
        }))
        
        setListings(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [price, removing, updating, updated, library, account])
  return [listings]
}