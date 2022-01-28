import React, { useState } from 'react'
import './Marketplace.css';
import { useTotalRarityStaked, useAPY } from '../actions/useNFTStaking';
import Wallet from './Wallet';
import NFTFarmingContent from './NFTFarmingContent';


export default function NFTFarming() {
  const [tab, setTab] = useState('your-nft');

  const [updated, setUpdated] = useState(0)
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

  return (
    <>
      <Wallet></Wallet>
      <div className="game-window">
        <div className='nft-menu'>
          <div className={tab === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => setTab("your-nft")}>Your NFT</div>
          <div className={tab === 'nft-overview' ? 'menu-item nft-overview' : 'menu-item nft-overview inactive'} onClick={() => setTab("nft-overview")}>Overview</div>
        </div>
        {tab === "your-nft" &&
          <NFTFarmingContent updated={updated} setUpdated={setUpdated} />
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
