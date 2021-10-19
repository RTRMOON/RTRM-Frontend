import logo from './logo.svg';
import './App.css';
import GameWindow from './components/GameWindow';
import homeIcon from './images/social/home.png';
import twitterIcon from './images/social/twitter.png'
import discordIcon from './images/social/discord.png'
import telegramIcon from './images/social/telegram.png'
import instagramIcon from './images/social/ig.png'


function App() {

  return (
    <div className="App">
      <div className="col-left">
        <div className="sec1">
          <h1>Dashboard</h1>
          <div className="menuList">
            <div className="listItem 1 active">
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
<GameWindow />
      </div>
      <div class="background-container">
          <div class="stars"></div>
          <div class="twinkling"></div>
      </div>
    </div>
  );
}

export default App;
