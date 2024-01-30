import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'
// import { useContract } from '@thirdweb-dev/react';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  // const {contract:Contract}=useContract('0xb7C25566660018C3Fb15Ac60766c1A10e309ad92')
  // console.log('fetching contract...',Contract);
  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    console.log(data);
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) {
      console.log('fetching campaigns')
      fetchCampaigns();}
      else console.log('no contracts found ')
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home