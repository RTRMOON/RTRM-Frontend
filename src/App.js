import React, {Component, useState} from 'react'
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import logo from './logo.svg';
import './App.css';
import GameWindow from './components/GameWindow';
import MobileWindow from './components/MobileWindow';
import Staking from './components/Staking'
import homeIcon from './images/social/home.png';
import twitterIcon from './images/social/twitter.png'
import discordIcon from './images/social/discord.png'
import telegramIcon from './images/social/telegram.png'
import instagramIcon from './images/social/ig.png'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider)
}
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: "arcade",
    };
  }

  render(){

  return(
    <>
    <BrowserView>
    <Web3ReactProvider getLibrary={getLibrary}>
    <div className="App">
      <div className="col-left">
        <div className="sec1">
          <h1>Dashboard</h1>
          <div className="menuList">
            <div className="listItem 1 active" onClick={() => this.setState({ active: "arcade" })}>
              <h2>Arcade</h2>
            </div>
            <div className="listItem 1 notactive">
              <h2>Marketplace</h2>
            </div>
            <div className="listItem 1 notactive">
            <h2>NFT Farming</h2>
            </div>
            <div className="listItem 1 notactive">
            <h2>Staking</h2>
            </div>
          </div>
        </div>
        {/*<div className="sec2"></div>*/}
        <div className="sec3">
          <div className="gameList">
            <div className="game">
              <div className="gameIcon" id="spaceInvaders"></div>
              <div className="gameName">
                <h2>Space Invaders</h2>
                <h3>Insert Coins</h3>
              </div>
            </div>
            <div className="game">
            <div className="gameIcon" id="comingSoon"></div>
              <div className="gameName">
                <h2>Coming Soon</h2>
              </div>
            </div>
          </div>
          <div className='social-icons'>
            <a href='https://www.retromoonbsc.com/' target='_blank'><img src={homeIcon} /></a>
            <a href='/'><img src={discordIcon} /></a>
            <a href='/'><img src={telegramIcon} /></a>
            <a href='/'><img src={twitterIcon} /></a>
            <a href='/'><img src={instagramIcon} /></a>

          </div>
        </div>
      </div>
      <div className="col-right">
      {this.state.active  === "arcade" && <GameWindow />}
      {this.state.active  === "staking" && <Staking />}
      </div>
      <div class="background-container">
          <div class="stars"></div>
          <div class="twinkling"></div>
      </div>
    </div>
    </Web3ReactProvider>
    </BrowserView>
    <MobileView>
      <MobileWindow />
    </MobileView>
    </>
  );
  }
}

export default App;
