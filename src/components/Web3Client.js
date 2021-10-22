import Web3 from 'web3';

let selectedAccount;
const providerUrl = process.env.PROVIDER_URL || 'https://bsc-dataseed1.binance.org';

export const init = () => {
    let provider = window.ethereum;
    const isActive = false;

    if(typeof provider !== 'undefined'){
        //Metamask is installed

        provider.request({method: 'eth_requestAccounts'})
        .then(accounts =>{
            selectedAccount = accounts[0];
            console.log(`Selected account is  ${selectedAccount}`);
        }).catch(err => {
            console.log(err);
        });

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0];
            isActive(true);
            console.log(`Selected account changed to ${selectedAccount}`);
        });
        
    }
    const web3 = new Web3(providerUrl);
}