import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import '@primitivefi/hardhat-dodoc';
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";

import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";

require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  solidity: {
    compilers:[
      {
				version: "0.8.9",
				settings: {
					optimizer: {
						enabled: true,
						runs: 100000
					}
				  }
			},
    ]
  },
  dodoc: {
    runOnCompile: false,
    freshOutput: false,
    exclude: [
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    localhost: {
      url: "https://127.0.0.1:8545/",
      live: false,
      saveDeployments: true,
    },
    hardhat: {
      live: false,
      saveDeployments: true,
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  typechain: {
    outDir: "types/",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 21,
  },
  namedAccounts: {
    deployer: 0,
    GSGVault: {
      default: 1,
      "polygon": "0xef44361cd3B3FB66949c458Da587A92250F45524"
    },
    GSGOracleAddress: {
      "polygon": "",
      default: 2 //TODO: make this point to an oracle
    },
    feeAddress: {
      "polygon": "0xef44361cd3B3FB66949c458Da587A92250F45524",
      "hardhat": "0xef44361cd3B3FB66949c458Da587A92250F45524",
      "mumbai": "0xef44361cd3B3FB66949c458Da587A92250F45524", //TODO: does this need to change
      default: 1
    },
    USDCAddress: {
      "polygon": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      default: 3
    },
    ChainlinkUSDCAggregator: {
      "polygon": "0xfe4a8cc5b5b2366c1b58bea3858e81843581b2f7",
      default: 4
    },
    BCTAddress: {
      "polygon": "0x2F800Db0fdb5223b3C3f354886d907A671414A7F",
      default: 5
    },
    NCTAddress: {
      "polygon": "0xd838290e877e0188a4a44700463419ed96c16107",
      default: 6
    },
    MCO2Address: {
      "polygon": "0xaa7dbd1598251f856c12f63557a4c4397c253cea",
      default: 7
    },
    
    SUSHI_FACTORY: {
      "polygon": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
      default: 8
    },
    SUSHI_PAIR_USDC_NCT: {
      "polygon": "0xdb995f975f1bfc3b2157495c47e4efb31196b2ca",
      default: 9
    },
    SUSHI_PAIR_USDC_BCT: {
      "polygon": "0x1E67124681b402064CD0ABE8ed1B5c79D2e02f64",
      default: 10
    },
    TOKEN_WETH: {
      "polygon": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      default: 11
    },
    TOKEN_WBTC: {
      "polygon": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      default: 12
    },
    TOKEN_UNI: {
      "polygon": "0xb33eaad8d922b1083446dc23f610c2567fb5180f",
      default: 13
    },
    TOKEN_AAVE: {
      "polygon": "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      default: 14
    },
    CHAINLINK_ETH: {
      "polygon": "0xf9680d99d6c9589e2a93a78a04a279e509205945",
      default: 15
    },
    CHAINLINK_BTC: {
      "polygon": "0xc907e116054ad103354f2d350fd2514433d57f6f",
      default: 16
    },
    CHAINLINK_UNI: {
      "polygon": "0xdf0fb4e4f928d2dcb76f438575fdd8682386e13c",
      default: 17
    },
  },
} as HardhatUserConfig;