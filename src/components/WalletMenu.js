import React, {useCallback, useRef, useEffect} from 'react'
import {useSpring, animated} from 'react-spring'
import './WalletMenu.css'
import walletBG from '../images/ModalMenu.png'
import closeBTN from '../images/closeBTN.png'
import coinLogo from '../images/coinLogo.png'
import BNBlogo from '../images/binance-coin-bnb-logo.webp'


export const WalletMenu = ({showModal, setShowModal, BNBbalance, Rmoonbalance, account}) => {

    const modalRef = useRef()

    const animation = useSpring ({
        config: {
            duration: 300
        },
        overlay: {zIndex: 1000},
        transform: showModal ? `translateY(0%)` : `translatey(-100%)`
    })

    const fadeAnimation = useSpring ({
        config: {
            duration: 200
        },
        opacity: showModal ? 1:0,
    });

    const closeModal = e => {
        if(modalRef.current === e.target){
            setShowModal(false);
        }

    };

    return (
        <>{showModal ? 
            <animated.div style={fadeAnimation}>
        <div className='wallet-container' ref={modalRef} onClick={closeModal}>
            <animated.div className='animationFront' style={animation}>
            <div className='wallet-modal'>
                <div className='wallet-actions'>
                <h2>Your Wallet</h2>
                    <p>Your address: <a className='yourWallet'>...{account.substring(33, 43)}</a></p>
                    <p>$BNB Balance: <a className='coins'>{BNBbalance}</a><img className='BNBlogo' src={BNBlogo}/></p>
                    <p>$RETRO Balance: <a className='coins RMOON'>{Rmoonbalance} $R</a></p>
                    <a href='https://pancakeswap.finance/swap#/swap?outputCurrency=0xE81FE8bBBEA13A0fd5Cc0AAFb6062631C659eC54' target='_blank'><button className='deposit btn' onClick="window.open('https://pancakeswap.finance/swap#/swap?outputCurrency=0xE81FE8bBBEA13A0fd5Cc0AAFb6062631C659eC54')">Buy $RETRO Tokens</button></a>
                </div>
                <img src={closeBTN} className='closeBTN' onClick={() => setShowModal(prev => !prev)}/>
                <img src={walletBG} className='modalBG'/>
            </div>
            </animated.div>
        </div>
        </animated.div>
        : null}
        </>
    )
}