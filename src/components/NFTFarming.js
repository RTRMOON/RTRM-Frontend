import React, { useState } from 'react'
import './Marketplace.css';
import addresses from '../assets/addresses.json'
import useBalance from '../actions/useBalance';
import { useWeb3React } from '@web3-react/core';
import { useTotalRarityStaked, useCalculateTotalRewards, useAPY, useTotalClaimed, useNfts, useCanDeposit } from '../actions/useNFTStaking';
import { useNFTStakingContract } from '../assets/NFTStakingContract';
import { useRetromoonPrice } from '../actions/usePrice';
import Wallet from './Wallet';


export default function NFTFarming() {
  const [tab, setTab] = useState('your-nft');
  const { active, chainId } = useWeb3React()

  const [updated, setUpdated] = useState(0)
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

  const nfts = useNfts(updated, setUpdated)

  const canDeposit = useCanDeposit()
  const rmoonPrice = useRetromoonPrice(updated)
  const totalRewards = useCalculateTotalRewards(updated)
  const totalClaimed = useTotalClaimed(updated)
  const stakingContract = useNFTStakingContract()
  const [acting, setActing] = useState({})

  function claimAllRewards() {
    setActing({...acting, 'claiming': true })
    stakingContract.claimAllRewards().then(() => {
      setUpdated(updated + 1)
    })
    .finally(() => {
      setActing({...acting, 'claiming': false })
    })
  }

  function approveForStaking(nft) {
    setActing({...acting, [nft]: true });
    stakingContract.approveContract(nft).then(() => {
      setUpdated(updated + 1)
    })
    .finally(() => {
      setActing({...acting, [nft]: false })
    })
  }

  function stake(nft, id) {
    setActing({...acting, [nft+id]: true })
    stakingContract.stake(nft, id).then(() => {
      setUpdated(updated + 1)
    })
    .finally(() => {
      setActing({...acting, [nft+id]: false })
    })
  }
  
  function unstake(nft, id) {
    setActing({...acting, [nft+id]: true })
    stakingContract.unstake(nft, id).then(() => {
      setUpdated(updated + 1)
    })
    .finally(() => {
      setActing({...acting, [nft+id]: false })
    })
  }

  function usdValue(amount) {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(amount * rmoonPrice)
}

  return (
    <>
      <Wallet></Wallet>
      <div className="game-window">
        <div className='nft-menu'>
          <div className={tab === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => setTab("your-nft")}>Your NFT</div>
          <div className={tab === 'nft-overview' ? 'menu-item nft-overview' : 'menu-item nft-overview inactive'} onClick={() => setTab("nft-overview")}>Overview</div>
        </div>
        {tab === "your-nft" &&
          <div className='nftBox nftStaking'>
            <table className='yourRmoon'>
              <tr>
                <td>Wallet Balance:</td>
                <td title={Rmoonbalance}>{Math.round(Rmoonbalance).toLocaleString()} $RETRO <span title={Rmoonbalance * rmoonPrice} className='usd-label'>{usdValue(Rmoonbalance)}</span></td>
              </tr>
              <tr>
                <td>Unclaimed:</td>
                <td title={totalRewards}>{Math.round(totalRewards).toLocaleString()} $RETRO <span title={totalRewards * rmoonPrice} className='usd-label'>{usdValue(totalRewards)}</span></td>
              </tr>
              <tr>
                <td>Total Claimed:</td>
                <td title={totalClaimed}>{Math.round(totalClaimed).toLocaleString()} $RETRO <span title={totalClaimed * rmoonPrice} className='usd-label'>{usdValue(totalClaimed)}</span></td>
              </tr>
            </table>
            <button className='small-button' onClick={claimAllRewards} disabled={acting['claiming'] || !active}>Claim</button>
            <button className='small-button' onClick={() => setUpdated(updated + 1)} disabled={acting['claiming'] || !active}>Refresh</button>
            { nfts ? nfts.map(nft => {
              return nft.staked ? (
                <div className='nft nftBuyBox' key={nft.tokenId + nft.nftAddress}>
                  <video src={nft.media} width="180" height="248" autoPlay loop muted controls='' />
                  <h3>Token ID: {nft.tokenId}</h3>
                  <h3>Rarity: {nft.rarity}</h3>
                  <h3 title={nft.rewards}>Rewards: {Math.round(nft.rewards).toLocaleString()}</h3>
                  <h3 title={nft.apy + '%'}>APY: {Math.round(nft.apy).toLocaleString()}%</h3>
                  <button onClick={() => unstake(nft.nftAddress,  nft.tokenId)} disabled={acting[nft.nftAddress+nft.tokenId]}>Unstake</button>
                </div>
              ) : (
                <div className='nft nftBuyBox' key={nft.tokenId + nft.nftAddress}>
                  <video src={nft.media} width="180" height="248" autoPlay loop muted controls='' />
                  <h3>Token ID: {nft.tokenId}</h3>
                  <h3>Rarity: {nft.rarity}</h3>
                  <h3 title={nft.apy + '%'}>APY: {Math.round(nft.apy).toLocaleString()}%</h3>
                  {
                    nft.approved ?
                    <button onClick={() => stake(nft.nftAddress, nft.tokenId)} disabled={!canDeposit || acting[nft.nftAddress+nft.tokenId]}>Stake</button> :
                    <button onClick={() => approveForStaking(nft.nftAddress)} disabled={acting[nft.nftAddress]}>Approve</button>
                  }
                </div>
              )
            }) : <>Loading...</>}
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
                  <td>{Math.round(commonAPY)}%</td>
                </tr>
                <tr>
                  <td>UNCOMMON</td>
                  <td>{uncommonBalance}</td>
                  <td>{Math.round(uncommonAPY)}%</td>
                </tr>
                <tr>
                  <td>RARE</td>
                  <td>{rareBalance}</td>
                  <td>{Math.round(rareAPY)}%</td>
                </tr>
                <tr>
                  <td>EPIC</td>
                  <td>{epicBalance}</td>
                  <td>{Math.round(epicAPY)}%</td>
                </tr>
                <tr>
                  <td>LEGENDARY</td>
                  <td>{legendaryBalance}</td>
                  <td>{Math.round(legendaryAPY)}%</td>
                </tr>
              </table>
            </div>
          </div>
          </div>

        }
      </div>
    </>
  )
}
