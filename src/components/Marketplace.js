import React, { useState } from 'react'
import './Marketplace.css';
import { useListings, SortOrders, useOwnedNfts, useOwnedListings } from '../actions/useMarketplace';
import { useWeb3React } from '@web3-react/core';
import Wallet from './Wallet';



export default function Marketplace() {
  const [tab, setTab] = useState('for-sale');
  const [sort, setSort] = useState(SortOrders.PriceAsc)
  const [filter, setFilter] = useState({})
  const [updated, setUpdated] = useState(0)
  const { active } = useWeb3React()


  const listings = useListings(updated, setUpdated, sort, filter)
  const nfts = useOwnedNfts(updated, setUpdated)
  const sellerListings = useOwnedListings(updated, setUpdated)

  function checkNftAmount(){
    if(nfts.length === 0) {
      return(
        <h1>You currently don't own any NFTs, get playing!</h1>
      )
    }
  }
  return (
    <>
      <Wallet></Wallet> 
      <div className="game-window">
        <div className='nft-menu'>
          <div className={tab === 'for-sale' ? 'menu-item for-sale' : 'menu-item for-sale inactive'} onClick={() => setTab("for-sale")}>For Sale</div>
          <div className={tab === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => setTab("your-nft")}>Your NFT</div>
        </div>
        {tab === "for-sale" && <div className="dropdown">
          <button className="dropbtn menu-item">Sort By:</button>
          <div className="dropdown-content">
            <a href="#" onClick={() => setSort(SortOrders.PriceAsc)}>Lowest Price</a>
            <a href="#" onClick={() => setSort(SortOrders.PriceDesc)}>Highest Price</a>
            <a href="#" onClick={() => setSort(sort === SortOrders.RarityAsc ? SortOrders.RarityDesc : SortOrders.RarityAsc)}>Rarity</a>
          </div>
        </div>
        }
        {tab === "for-sale" &&
          <div className='nftBox'>
            {active ? null : <h1>Connect your wallet to see NFTs</h1>}
 
            {listings}
          </div>
        }
        {tab === "your-nft" &&
          <div className='nftBox'>
          {active ? 
            checkNftAmount()
          : <h1>Connect your wallet to see NFTs</h1>}
            {nfts}
            {active ? 
              <>
              <h1>Your Listings</h1>
              {sellerListings}
              </> : ''}
          </div>

        }
      </div>
    </>
  )
}
