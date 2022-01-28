import React, { useRef } from 'react'
import {useSpring, animated} from 'react-spring'
import './WalletMenu.css'
import walletBG from '../images/ModalMenu.png'
import closeBTN from '../images/closeBTN.png'
import BNBlogo from '../images/binance-coin-bnb-logo.webp'
import { useWeb3React } from '@web3-react/core'


export const WalletMenu = ({showModal, setShowModal, onModalClose, BNBbalance, Rmoonbalance, account}) => {

    const { connector, deactivate } = useWeb3React()
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
            onModalClose();
        }
    };

    const disconnect = () => {
        setShowModal(false)
        onModalClose()
        deactivate(connector)
    }

    return (
        <>{showModal ? 
            <animated.div style={fadeAnimation}>
        <div className='wallet-container' ref={modalRef} onClick={closeModal}>
            <animated.div className='animationFront' style={animation}>
            <div className='wallet-modal'>
                <div className='wallet-actions'>
                <h2>Your Wallet</h2>
                    <p title={account}>Your address: <span className='yourWallet'>{account.substring(0, 5)}...{account.substring(38, 43)}</span></p>
                    <p>$BNB Balance: <span className='coins'>{BNBbalance}</span><img alt="BNB" className='BNBlogo' src={BNBlogo}/></p>
                    <p>$RETRO Balance: <span className='coins RMOON'>{Rmoonbalance} $R</span></p>
                    <a href='https://pancakeswap.finance/swap#/swap?outputCurrency=0xE81FE8bBBEA13A0fd5Cc0AAFb6062631C659eC54' target='_blank' rel='noreferrer'><button className='deposit btn' onClick="window.open('https://pancakeswap.finance/swap#/swap?outputCurrency=0xE81FE8bBBEA13A0fd5Cc0AAFb6062631C659eC54')">Buy $RETRO Tokens</button></a>
                    <button className='deposit btn' onClick={disconnect}>Disconnect Account</button>
                </div>
                <img alt="X" src={closeBTN} className='closeBTN' onClick={() => setShowModal(prev => !prev)}/>
                <img alt="Background" src={walletBG} className='modalBG'/>
            </div>
            </animated.div>
        </div>
        </animated.div>
        : null}
        </>
    )
}