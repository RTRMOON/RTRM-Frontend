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
import nftAbi from '../abi/RetromoonNFT.json'
import marketplaceAbi from '../abi/RetromoonMarket.json'

const rarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"]

class Marketplace extends Component{
  constructor(props) {
    super(props);
    this.state = {
      active: "for-sale",
      listings: []
    };
    this.web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

    this.getListings().then(data => {
      this.setState({ listings: data })
    })
  }

  async getListings() {
    const contract = new this.web3.eth.Contract(marketplaceAbi, '0xE09A83E2a95376D25b0F02239DDa418B39E1729c')
    const listings = await contract.methods.getActiveListings().call()
    return Promise.all(listings.map(async listing => {
      await this.getNftData(listing.nftAddress, listing.tokenId)
      return (
        <div className='nft'>
          <img src={nftExample} />
          <h3>Staking: 1.5x</h3>
          <h3>Rarity: {rarities[listing.rarity]}</h3>
          <h3>{this.web3.utils.fromWei(listing.price)} BNB</h3>
        </div>
      )
    }))
  }

  async getNftData(address, id) {
    const contract = new this.web3.eth.Contract(nftAbi, address)
    const name = await contract.methods.name().call()
    // To get images, this returns a json file from IPFS which if read has another ipfs link under "image" property for the mp4 we use
    // But it would probably be easier to use local image/mp4 files based off of nft contract address instead of reading ipfs
    const tokenUri = await contract.methods.tokenURI(id).call()
    console.log(tokenUri)
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
              {this.state.listings}
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
