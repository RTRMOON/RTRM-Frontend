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
import demoImage from '../images/nfts/cheef.mp4'


export default function NFTFarming() {
  const [tab, setTab] = useState('your-nft');
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
          <div className={tab === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => setTab("your-nft")}>Your NFT</div>
          <div className={tab === 'nft-overview' ? 'menu-item nft-overview' : 'menu-item nft-overview inactive'} onClick={() => setTab("nft-overview")}>Overview</div>
        </div>
        {tab === "your-nft" &&
          <div className='nftBox nftStaking'>
            <table className='yourRmoon'>
              <tr>
                <td>Wallet Balance:</td>
                <td>{Rmoonbalance} $R</td>
              </tr>
              <tr>
                <td>Unclaimed:</td>
                <td> $R</td>
              </tr>
              <tr>
                <td>Total Claimed:</td>
                <td> $R</td>
              </tr>
            </table>
            <div className='nft nftBuyBox'>
              <video className='NFTvideo' src={demoImage} width="180" height="248" autoPlay loop muted controls=''/>
              <h3>Rarity: LEGENDARY</h3>
              <h3>APY: 200%</h3>
              <h3>100 $R Unclaimed</h3>
              <h3>70 Days Staked</h3>
              <button>CLAIM</button>
              <button>Unstake</button>
            </div>
            <div className='nft nftBuyBox'>
              <video className='NFTvideo' src={demoImage} width="180" height="248" autoPlay loop muted controls=''/>
              <h3>Rarity: LEGENDARY</h3>
              <h3>APY: 200%</h3>
              <button>Stake</button>
            </div>
          </div>
        }
        {tab === "nft-overview" &&
          <div className='nft-selected'>
          <div className='nftBox rarityOverview'>
            <div className='nftRarity'>
              <table>
                <tr>
                  <th>Rarity</th>
                  <th>NFT's in pool</th>
                  <th>APY</th>
                </tr>
                <tr>
                  <td>COMMON</td>
                  <td>58</td>
                  <td>150%</td>
                </tr>
                <tr>
                  <td>UNCOMMON</td>
                  <td>28</td>
                  <td>250%</td>
                </tr>
                <tr>
                  <td>RARE</td>
                  <td>10</td>
                  <td>450%</td>
                </tr>
                <tr>
                  <td>EPIC</td>
                  <td>5</td>
                  <td>550%</td>
                </tr>
                <tr>
                  <td>LEGENDARY</td>
                  <td>2</td>
                  <td>950%</td>
                </tr>
              </table>
            </div>
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
