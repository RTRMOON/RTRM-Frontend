import React, { useState } from 'react'
import './Marketplace.css';
import { useListings, SortOrders, useOwnedNfts } from '../actions/useMarketplace';
import nftExample from '../images/nftexample.png'
import addresses from '../assets/addresses.json'
import { WalletMenu } from './WalletMenu'
import useBalance from '../actions/useBalance';
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { injected } from '../wallet/connectors';
import { useWeb3React } from '@web3-react/core';
import Modal from 'react-modal/lib/components/Modal';



export default function Marketplace() {
  const [tab, setTab] = useState('for-sale');
  const [sort, setSort] = useState(SortOrders.PriceAsc)
  const [filter, setFilter] = useState({})
  const { active, account, activate } = useWeb3React()

  const [BNBbalance] = useBalance(addresses.BNB, "18");
  const [Rmoonbalance] = useBalance(addresses.Retromoon, "18");

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  const [showModal, setShowModal] = useState(false)

  const openModal = () => {
    setShowModal(prev => !prev)
  }

  const onModalClose = () => console.log('closeMenu');


  const listings = useListings(sort, filter)
  const nfts = useOwnedNfts()
  console.log(nfts)

  function checkNftAmount(){
  if(nfts.length === 0) {
    return(
      <h1>You currently don't own any NFTs, get playing!</h1>
    )
  }
}
  return (
    <>
      <WalletMenu showModal={showModal} setShowModal={setShowModal} BNBbalance={BNBbalance} Rmoonbalance={Rmoonbalance} account={account} onModalClose={onModalClose} />

      <div className="game-window">
        <div className='button-wrapper'>
          <div className='connector-button'>
            {active ? <div className='connect-wallet' onClick={openModal}><a className='coins'><a className='BNB-token'>{BNBbalance}<img className='BNBlogo' src={BNBlogo} /></a><a className='RMOON-Token'>{Rmoonbalance} $R</a></a>{/*<img className='coinLogo' src={coinLogo} /> <a className='nowConnected'>click to deposit</a>*/}</div> : <div className='connect-wallet' onClick={connect}>Connect Wallet</div>}
          </div>
        </div>
        <div className='nft-menu'>
          <div className={tab === 'for-sale' ? 'menu-item for-sale' : 'menu-item for-sale inactive'} onClick={() => setTab("for-sale")}>For Sale</div>
          <div className={tab === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => setTab("your-nft")}>Your NFT</div>
        </div>
        {tab === "for-sale" && <div class="dropdown">
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
          <div className='nft-selected'>
          <div className='nftBox'>
          {active ? 
            checkNftAmount()
          : <h1>Connect your wallet to see NFTs</h1>}
            {nfts}
          </div>
          {/*
            <div className='top-section'>
              <div className='nft-image'>
                <img src={nftExample}></img>
              </div>
              <div className='nft-description'>
                <h1>Mining Zombie</h1>
                <h2>Rarity: Common</h2>
                <h2>Staking: 1.5X</h2>
                <h2>Token ID: 0</h2>
                <p>Common Mining Zombie from Series 1 of Retromoon Arcade Platform NFTs</p>
                <div className='sell-btn'>Sell your NFT</div>
              </div>
            </div>
          */}
          </div>

        }
      </div>
    </>
  )
}
