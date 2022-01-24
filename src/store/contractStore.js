import ERC20ABI from '../assets/abi-erc20.json'
import marketplaceABI from '../assets/abi-marketplace.json'
import nftABI from '../assets/abi-nft.json'
import stakingABI from '../assets/abi-staking.json'
import nftStakingABI from '../assets/abi-nft-staking.json'
import pancakeABI from '../assets/abi-pancakepair.json'

export function getPancakePair(pairAddress, web3) {
  return web3
    ? new web3.eth.Contract(pancakeABI, pairAddress, {
      from: web3.eth.defaultAccount
    })
    : null
}

export function getERC20Contract(tokenAddress, web3) {
  return web3
    ? new web3.eth.Contract(ERC20ABI, tokenAddress, {
        from: web3.eth.defaultAccount,
      })
    : null
}

export function getMarketplaceContract(marketplaceAddress, web3, account) {
  return web3
    ? new web3.eth.Contract(marketplaceABI, marketplaceAddress, {
        from: account || web3.eth.defaultAccount,
      })
    : null
}

export function getNftContract(nftAddress, web3) {
  return web3
    ? new web3.eth.Contract(nftABI, nftAddress, {
        from: web3.eth.defaultAccount,
      })
    : null
}

export function getStakingContract(stakingAddress, web3, account) {
  return web3
    ? new web3.eth.Contract(stakingABI, stakingAddress, {
        from: account || web3.eth.defaultAccount,
      })
    : null
}

export function getNFTStakingContract(nftStakingAddress, web3, account) {
  return web3
    ? new web3.eth.Contract(nftStakingABI, nftStakingAddress, {
        from: account || web3.eth.defaultAccount,
      })
    : null
}