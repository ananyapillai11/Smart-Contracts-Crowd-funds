// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
    }

    mapping(uint256 => Campaign) public campaigns;
        mapping(uint256=>mapping(address=>uint256)) donatorss;


    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable returns(uint256) {
        require(msg.value > 0, "Contribution amount must be greater than 0");
        uint256 amount = msg.value;


        Campaign storage campaign = campaigns[_id];
        if(donatorss[_id][msg.sender]>0){

        }else {
        campaign.donators.push(msg.sender);
        }
        donatorss[_id][msg.sender]+=amount;
        // campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
        return donatorss[_id][msg.sender];
    }

    function getDonators(uint256 _id) view public returns (address[] memory) {
        return campaigns[_id].donators;

    }
    function getDonationAmount(uint256 _id, address donor) view public returns(uint256){
        return donatorss[_id][donor] ;
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
    function withdrawAmount(uint256 _id,address msg_sender) public returns(bool result){
        //owner only able to withdraw after deadline and only when goal is reached 
        result=false;
        address sender=msg_sender;
        // require(block.timestamp>campaigns[_id].deadline,"Campaign has not ended ");
        if(campaigns[_id].owner==sender){
            if(campaigns[_id].amountCollected<campaigns[_id].target){
                revert("raised amount is less than the target only funders will be able to withdraw");
            }else{
                uint256 balance= address(this).balance;
                require(balance>0,"No funds to withdraw");
               (bool sent,) = payable(sender).call{value: balance}("");
               if(sent) result=true;
               
                //distribute rewards after that on owner discretion 
            }
        }
        // donator able to withdraw amount after deadline and when goal is not reached 
        else if(donatorss[_id][sender]>0){
            if(campaigns[_id].amountCollected>=campaigns[_id].target){
                revert("Funders will be rewarded ,no funds can be withdrawn ");
            }else {
                 uint256 funderAmount= donatorss[_id][sender];
                require(funderAmount>0,"No funds to withdraw");
                 donatorss[_id][sender]-=funderAmount;
                 campaigns[_id].amountCollected-=funderAmount;
                // payable(msg.sender).transfer(funderAmount);
               (bool sent,) = payable(sender).call{value: funderAmount}("");
               if(sent) result=true;

            }
        }else {
            revert("Access to the funds denied ");
        }
    }

}