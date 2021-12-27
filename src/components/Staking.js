import React from 'react'
import './Staking.css'

function Staking() {
    return (
        <div>
            <div className='stakingWindow'>
                <div className='stakingHeader'>Staking</div>
                <div className='stakingContent'>
                    <p>Total Value Locked (TVL):</p>
                    <p>2,342,524,444 $RETRO</p>
                    <p className='TVLUSD'>$2,523,444</p>
                    <div className='stakingInfo'>
                        <div className='col-2'><p>Earned</p><p><a className='tokenNumber'>2.444</a> $RETRO</p><p>Staked</p><p><a className='tokenNumber'>10.244</a> $RETRO</p></div>
                        <div className='col-2 right-col'><p>APY</p><p><a className='tokenNumber'>15%</a></p></div>
                    </div>
                    <div className='stakeButtons'>
                        <input placeholder='0'></input><button className='max-button'>MAX</button>
                        <button className='stake-button'>STAKE</button>
                    </div>
                    <div className='unstakeButtons'>
                        <input placeholder='0'></input><button className='max-button'>MAX</button>
                        <button className='stake-button'>UNSTAKE</button>
                        <button className='claim-button'>Claim Rewards</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Staking
