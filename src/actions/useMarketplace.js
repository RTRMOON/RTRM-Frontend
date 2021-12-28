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

export function useOwnedNfts() {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [nfts, setNfts] = useState([])
  let setPrice = ''


  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      
      function handleChangeEvent(e) {
        setPrice = e.target.value;
      }

      const ownedNfts = []
      const characters = await marketplace.getNftsByPlayer(account)
      for (const character of characters) {
        const nftContract = getNftContract(character, library)
        const approved = await marketplace.isApproved(character)
        let approving = false

        function approveForListing(character) {
          // TODO: Actually handle setting approving state to disable button
          approving = true
          marketplace.approveContract(character)
          .then(receipt => {
            // TODO: Reload to show sell button and input
            // isApproved should return true now
            console.log(receipt)
          })
          .finally(() => {
            // TODO: Enable approve button (e.g. user rejects or tx fails)
            approving = false
          })
        }

        function createListing(tokenId) {
          // TODO: Disable sell button
          const price = library.utils.toWei(setPrice.toString())
          marketplace.createListing(character, tokenId, price)
          .then(receipt => {
            // TODO: Reload to remove NFT from sellers NFT list and show in listings
            console.log(receipt)
          })
          .finally(() => {
            // TODO: Enable sell button (e.g user rejects or tx fails)
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
              <input type="number" min="0" name="sellPrice" placeholder='Input price in BNB'
              onChange={handleChangeEvent}
              
              />
              </form>
              <button onClick={() => createListing(x)}>Sell NFT</button>
              </>  :
              <button onClick={() => approveForListing(character)} disabled={approved || approving}>Approve</button>
              
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
  }, [account, library])
  return nfts
}

export function useListings(sort, filter) {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [listings, setListings] = useState([])
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const amountForSale = 0;
  function openBuyModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
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
        data = await Promise.all(data.map(async listing => {
          function purchaseListing() {
            // TODO: Disable purchase button
            marketplace.purchaseListing(listing.id)
            .then(receipt => {
              // TODO: Refresh to remove listing and add to buyer's list
              console.log(receipt)
            })
            .finally(() => {
              // TODO: Enable buy button (e.g. user rejects or tx fails)
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
              <button onClick={purchaseListing}>Buy NFT</button>
            </div>
          )
        }))
        
        setListings(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [sort, filter, library, account])
  return [listings]
}

export function useOwnedListings() {
  const { account, library } = useWeb3React()
  const marketplace = useMarketplaceContract()
  const [listings, setListings] = useState([])

  useEffect(() => {
    let isCancelled = false;
    
    (async () => {
      let data = await marketplace.getSellerListings(account)

      if (!isCancelled) {
        // Ensure we have only valid listings (contract may return empty listings to fill array length)
        data = data.filter(x => x.seller !== ZERO_ADDRESS)

        // Map to NFT listing elements
        data = await Promise.all(data.map(async listing => {
          let setPrice = library.utils.fromWei(listing.price)
          function handleChangeEvent(e) {
            setPrice = e.target.value;
          }

          function updateListing() {
            // TODO: Disable purchase button
            marketplace.updateListing(listing.id, library.utils.toWei(setPrice))
            .then(receipt => {
              // TODO: Refresh to remove listing and add to buyer's list
              console.log(receipt)
            })
            .finally(() => {
              // TODO: Enable buy button (e.g. user rejects or tx fails)
            })
          }

          function removeListing() {
            // TODO: Disable remove button
            marketplace.removeListing(listing.id)
            .then(receipt => {
              // TODO: Refresh to remove listing
              console.log(receipt)
            })
            .finally(() => {
              // TODO: Enable remove button (e.g. user rejects or tx fails)
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
              <input type="number" min="0" defaultValue={library.utils.fromWei(listing.price)} name="sellPrice" placeholder='Input price in BNB'
              onChange={handleChangeEvent}
              
              />
              </form>
              <button onClick={updateListing}>Update</button>
              <button onClick={removeListing}>Remove</button>
            </div>
          )
        }))
        
        setListings(data)
      }
    })()

    return () => {
      isCancelled = true
    }
  }, [library, account])
  return [listings]
}