import React, { useRef } from 'react'
import './GameWindow.css';
import Wallet from './Wallet';


function GameWindow() {
  const iframeRef = useRef(null);
  const focusGame = () => iframeRef.current.contentDocument.querySelector('canvas').focus();

  const onLoad = () => iframeRef.current.contentWindow.onclick = focusGame;

  const onModalClose = () => focusGame();


  return (
    <>
    <Wallet onModalClose={onModalClose}/>

    <div className="game-window">
        {/* use the following when testing locally */}
        {/*<iframe ref={iframeRef} title="Moon Invaders RetroMoon" src="./mooninvaders/index.html" height="768" width="1024" frameborder="0" onLoad={onLoad}><a href="">Moon Invaders</a></iframe><div className='iframe-overlay'></div>*/}
        <iframe ref={iframeRef} title="Moon Invaders RetroMoon" src="https://retromoonbsc.app/mooninvaders/index.html" height="768" width="1024" frameborder="0" onLoad={onLoad}><a href="">Moon Invaders</a></iframe><div className='iframe-overlay'></div>
    </div>
    </>
  )
}

export default GameWindow
