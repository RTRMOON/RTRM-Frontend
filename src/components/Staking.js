import React from 'react'
import './Staking.css'

import Wallet from './Wallet'
import StakingContent from './StakingContent';

function Staking() {
    return (
        <div>
            <Wallet></Wallet>
            <div className='stakingWindow'>
                <StakingContent />
            </div>
        </div>
    )
}

export default Staking
