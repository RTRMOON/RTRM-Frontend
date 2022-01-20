import React, { useState } from 'react'
import './Marketplace.css';
import { useListings, SortOrders } from '../actions/useMarketplace';
import nftExample from '../images/nftexample.png'
import addresses from '../assets/addresses.json'
import { WalletMenu } from './WalletMenu'
import useBalance from '../actions/useBalance';
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { injected } from '../wallet/connectors';
import { useWeb3React } from '@web3-react/core';
import Modal from 'react-modal/lib/components/Modal';
import { useTotalBalance, useOwnedNfts, useTotalRarityStaked, useCalculateTotalRewards, useAPY, useTotalClaimed } from '../actions/useNFTStaking';
import { useNFTStakingContract } from '../assets/NFTStakingContract';


export default function NFTFarming() {
  const [tab, setTab] = useState('your-nft');
  const [sort, setSort] = useState(SortOrders.PriceAsc)
  const [filter, setFilter] = useState({})
  const { active, account, activate, chainId } = useWeb3React()

  const [updated, setUpdated] = useState(0)
  const [BNBbalance] = useBalance(addresses.BNB, "18");
  const [Rmoonbalance] = useBalance(chainId === 56 ? addresses.Retromoon : addresses['Testnet Retromoon'], "18", updated);
  const commonBalance = useTotalRarityStaked(0, updated)
  const uncommonBalance = useTotalRarityStaked(1, updated)
  const rareBalance = useTotalRarityStaked(2, updated)
  const epicBalance = useTotalRarityStaked(3, updated)
  const legendaryBalance = useTotalRarityStaked(4, updated)
  const commonAPY = useAPY(0, updated)
  const uncommonAPY = useAPY(1, updated)
  const rareAPY = useAPY(2, updated)
  const epicAPY = useAPY(3, updated)
  const legendaryAPY = useAPY(4, updated)

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


  const nfts = useOwnedNfts(updated, setUpdated)

  const total = useTotalBalance(updated)
  const totalRewards = useCalculateTotalRewards(updated)
  const totalClaimed = useTotalClaimed(updated)
  const stakingContract = useNFTStakingContract()

  function claimAllRewards() {
    stakingContract.claimAllRewards().then(() => {
      setUpdated(updated + 1)
    })
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
                <td>{Rmoonbalance} $RETRO</td>
              </tr>
              <tr>
                <td>Unclaimed:</td>
                <td> {totalRewards} $RETRO</td>
              </tr>
              <tr>
                <td>Total Claimed:</td>
                <td> {totalClaimed} $RETRO</td>
              </tr>
            </table>
            <button onClick={claimAllRewards}>Claim Rewards</button>
            <button onClick={() => setUpdated(updated + 1)}>Refresh</button>
            { nfts }
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
                  <td>{commonBalance}</td>
                  <td>{commonAPY}%</td>
                </tr>
                <tr>
                  <td>UNCOMMON</td>
                  <td>{uncommonBalance}</td>
                  <td>{uncommonAPY}%</td>
                </tr>
                <tr>
                  <td>RARE</td>
                  <td>{rareBalance}</td>
                  <td>{rareAPY}%</td>
                </tr>
                <tr>
                  <td>EPIC</td>
                  <td>{epicBalance}</td>
                  <td>{epicAPY}%</td>
                </tr>
                <tr>
                  <td>LEGENDARY</td>
                  <td>{legendaryBalance}</td>
                  <td>{legendaryAPY}%</td>
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
