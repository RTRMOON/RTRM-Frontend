import React, {Component, useState, useEffect, useRef} from 'react'
import ReactGodot from 'react-godot'
import './Marketplace.css';
import styled from 'styled-components'
import coinLogo from '../images/coinLogo.png'
import { WalletMenu } from './WalletMenu'
import { useWeb3React } from "@web3-react/core"
import { Web3ReactProvider } from '@web3-react/core'
import { injected } from "../wallet/connectors"
import useBalance from '../actions/useBalance'
import Web3 from 'web3'
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import nftExample from '../images/nftexample.png'

class Marketplace extends Component{

  constructor(props) {
    super(props);
    this.state = {
      active: "for-sale",
    };
    
  }
  render(){
    return (
        <>
        <div className="game-window">
            <div className='button-wrapper'>

            </div>
            <div className='nft-menu'>
              <div className={this.state.active === 'for-sale' ? 'menu-item for-sale' : 'menu-item for-sale inactive'} onClick={() => this.setState({ active: "for-sale" })}>For Sale</div>
              <div className={this.state.active === 'your-nft' ? 'menu-item your-nft' : 'menu-item your-nft inactive'} onClick={() => this.setState({ active: "your-nft" })}>Your NFT</div>
            </div>
            {this.state.active  === "for-sale" && <div class="dropdown">
              <button class="dropbtn menu-item">Sort By:</button>
              <div class="dropdown-content">
                <a href="#">Lowest Price</a>
                <a href="#">Highest Price</a>
                <a href="#">Rarity</a>
              </div>
            </div>
  }
            {this.state.active  === "for-sale" &&
            <div className='nftBox'>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            <div className='nft'>
              <img src={nftExample} />
              <h3>Rarity: Rare</h3>
              <h3>Staking: 1.5X</h3>
              <h3>300,000$RETRO</h3>
            </div>
            </div>
            }
            {this.state.active  === "your-nft" &&
              <div className='nft-selected'>
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
              </div>

            }
        </div>
        
        </>
    )
  }
}

export default Marketplace
