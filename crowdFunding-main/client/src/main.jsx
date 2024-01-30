import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider,ChainId } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();

root.render(
  <ThirdwebProvider 
  //  signer={signer}
  // desiredChainId={ChainId.Goerli} 
  // desiredChainId={2} 
  activeChain={80001}
  // activeChain="Goerli"
  
  clientId="821d0af087f9eff42ef667f8d10512be" 
  > 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)
