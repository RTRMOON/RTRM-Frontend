import React, {Component, useState} from 'react';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import logo from './logo.svg';
import './App.css';
import GameWindow from './components/GameWindow';
import MobileWindow from './components/MobileWindow';
import Staking from './components/Staking'
import homeIcon from './images/social/home.png';
import twitterIcon from './images/social/twitter.png'
import chartIcon from './images/social/chart.png'
import telegramIcon from './images/social/telegram.png'
import instagramIcon from './images/social/ig.png'
import soundIcon from './images/sound_locked.png'
import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'

import Protect from 'react-app-protect'
import 'react-app-protect/dist/index.css'

const audioList1 = [
  {
    name: 'Moon Invaders Theme',
    singer: 'Dramshop Sound',
    cover:
      'https://retromoon.netlify.app/music/mooninvaders-theme-cover.jpg',
    musicSrc:
      'https://retromoon.netlify.app/music/mooninvaders-theme.wav',
  },
]

const options = {
  // audio lists model
  audioLists: audioList1,
  showDownload: false,
  glassBg: false,
  defaultVolume: 0.2,
  autoPlay: true,
}

function getLibrary(provider) {
  return new Web3(provider)
}
class App extends Component {

  state = {
    unmount: false,
    params: {
      ...options,
      getAudioInstance: (audio) => {
        this.audio = audio
      },
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      active: "arcade",
    };
    
  }
  render(){

  return(
    <Protect sha512='76F08707050E5674BCA900A54782DCCD6EF4B452EF8E18FABAA259D4447825515CD7C29281C93BE96438F7859DF701498CBC99F7642A1C1B11335742C67B6766'>

    <BrowserView>
    <Web3ReactProvider getLibrary={getLibrary}>
    <div className="App">
    {/*<ReactJkMusicPlayer {...options} />*/}
      <div className="col-left">
        <div className="sec1">
          <h1>Dashboard</h1>
          <div className="menuList">
            <div className={this.state.active === 'arcade' ? 'listItem 1 active' : 'listItem 1 notSet'} onClick={() => this.setState({ active: "arcade" })}>
              <h2>Arcade</h2>
            </div>
            <div className="listItem 1 notactive">
              <h2>Marketplace</h2>
            </div>
            <div className="listItem 1 notactive">
            <h2>NFT Farming</h2>
            </div>
            {/*<div className={this.state.active === 'staking' ? 'listItem 1 active' : 'listItem 1 notSet'} onClick={() => this.setState({ active: "staking" })}>*/}
            <div className='listItem 1 notactive'>
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
                <h2>Moon Invaders</h2>
                <h3>Selected</h3>
              </div>
            </div>
            <div className="game">
            <div className="gameIcon" id="comingSoon"></div>
              <div className="gameName">
                <h2>Coming Soon...</h2>
              </div>
            </div>
          </div>
          <div className='social-icons'>
            <a href='https://www.retromoonbsc.com/' target='_blank'><img src={homeIcon} /></a>
            <a href='/'><img src={chartIcon} /></a>
            <a href='https://t.me/retromoonofficial' target='_blank'><img src={telegramIcon} /></a>
            <a href='https://twitter.com/Retromoonbsc' target='_blank'><img src={twitterIcon} /></a>
            <a href='https://instagram.com/retromoonbsc' target='_blank'><img src={instagramIcon} /></a>

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
    </Protect>
  );
  }
}

export default App;
