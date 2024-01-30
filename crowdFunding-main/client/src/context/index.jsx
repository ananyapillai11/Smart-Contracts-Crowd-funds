import React, { useContext, createContext, useEffect } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite,useChainId } from '@thirdweb-dev/react';
// import {Goreil} from '@thirdweb-dev/chains'
import { ethers } from 'ethers';
// import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // try {
  // const { contract,isLoading,isError } = useContract('0xb7C25566660018C3Fb15Ac60766c1A10e309ad92');
  //   console.log(contract)
  // } catch (error) {
  //   console.log('something went wrong')
  //   console.log(error);
  // }
  // const { contract } = useContract('0xb7C25566660018C3Fb15Ac60766c1A10e309ad92');
  // const { contract } = useContract('0x44351197256bf5F94c629718459BD37ed9EB2081');
  const { contract } = useContract('0x72A5a2144F9ca919322919AA9D603ad2B6696206');


  // if(error) console.log('contractError',error)
  // if(isLoading) console.log('yet to be resolved ')
  console.log('contracts ...',contract);
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();

  const connect = useMetamask();
  const chainId=useChainId();
  console.log(chainId)
  console.log(address);
  console.log('contract',contract)

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
      console.log(new Date(form.deadline).getTime(),)
    }
  }

  const getCampaigns = async () => {
    console.log('getting campaigns...')
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));
    // console.log('parsedCampaigns',parsedCampaings);
    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    console.log(ethers.utils.parseEther(amount.toString()))
    const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount.toString())});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations.length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        // donator: donations[0][i],
        donator: donations[i],

        // donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }
    console.log('parsedDonations',parsedDonations)
    return parsedDonations;
  }
  const getDonationAmount=async (pId)=>{
    try {
      console.log('donatorAddress-->')
      console.log(address);
      const donationAmount= await contract.call('getDonationAmount',[pId,address])
      console.log('donationAmount-------->')
      console.log(address);
      console.log(donationAmount)
      const amount= parseFloat(ethers.utils.formatEther(donationAmount.toString())).toFixed(4);;
      console.log(amount)
      return amount;
      
    } catch (error) {
      console.log('something went wrong')
        console.log(error)
    }

  }
  const withdraw=async (pId)=>{
   const result = await contract.call('withdrawAmount',[pId,address])
   return result;
  }
  // const fetchContract=async()=>{
  //   const { contract,isLoading,error } =await  useContract('0xb7C25566660018C3Fb15Ac60766c1A10e309ad92');
  //   if(isLoading) console.log('isloading')
  //   if(error) console.log(error);
  //   if(contract) console.log(contract);

  // }

useEffect(()=>{
  // fetchContract();
},[])
  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        withdraw,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        getDonationAmount,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);

//extra functions added 
//getDonationAmount
//modified-getDonators