/** @type import('hardhat/config').HardhatUserConfig */
// import 'dotenv'
module.exports = {
  solidity: {
    version: '0.8.9',
    // defaultNetwork: 'goerli',
    defaultNetwork: 'polygon',

    networks: {
      hardhat: {},
      goerli: {
        // url: 'https://rpc.ankr.com/eth_goerli',
        url: 'https://polygon.rpc.thirdweb.com',


        accounts: [`0x${process.env.PRIVATE_KEY}`]
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
