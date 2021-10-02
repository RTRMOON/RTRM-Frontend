import logo from './logo.svg';
import './App.css';
import ReactGodot from 'react-godot'


function App() {
  return (
    <div className="App">
      <div className="col-left">
        <div className="sec1">
          <div className="menuList">
            <div className="listItem 1 active">
              <h2>Arcade</h2>
            </div>
            <div className="listItem 1">
              <h2>Marketplace</h2>
            </div>
            <div className="listItem 1">
            <h2>NFT Farming</h2>
            </div>
            <div className="listItem 1">
            <h2>Stakes</h2>
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
        </div>
      </div>
      <div className="col-right">
        <div className="game-window">
        <iframe title="Space Invaders RetroMoon" src="/retromoon/example/index.html" height="768" width="1024" frameborder="0"><a href="">Space Arcade</a></iframe>
        </div>
      </div>
      <div class="background-container">
          <div class="stars"></div>
          <div class="twinkling"></div>
      </div>
    </div>
  );
}

export default App;
