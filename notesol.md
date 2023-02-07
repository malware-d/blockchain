- [Contract](#contract)
- [State variables \& integers](#state-variables--integers)
- [Array](#array)
- [Function (private-internal/public-external)](#function-private-internalpublic-external)
  - [Function modifiers](#function-modifiers)
- [Keccack256](#keccack256)
- [Events](#events)
- [Mapping \& Addresses](#mapping--addresses)
  - [Address](#address)
  - [Mapping](#mapping)
- [msg.sender](#msgsender)
- [require](#require)
- [inheritance](#inheritance)
- [Data location (memory/storage/calldata)](#data-location-memorystoragecalldata)
- [Internal/External](#internalexternal)
- [Interacting with other contracts](#interacting-with-other-contracts)
- [Immutability of Contracts](#immutability-of-contracts)
- [Ownable Contracts](#ownable-contracts)
- [onlyOwner Function Modifier](#onlyowner-function-modifier)
- [Gas fee](#gas-fee)
  - [Struct packing to save gas](#struct-packing-to-save-gas)
- [Time Units](#time-units)
- [Saving Gas With 'View' Functions](#saving-gas-with-view-functions)
- [Storage is Expensive](#storage-is-expensive)
- [For Loops](#for-loops)
- [`payable` function](#payable-function)
- [Withdraws](#withdraws)
  
  

### Contract
Solidity's code is encapsulated in `contracts`. A **contract** is the fundamental building block of Ethereum applications — all variables and functions belong to a contract. All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use.
```php
pragma solidity >=0.5.0 <0.6.0;

contract HelloWorld {

}
```

### State variables & integers
`State variables` are permanently stored in contract storage (written to the Ethereum blockchain). ***All variables decleared outside the function are state (`storage` loctation) and vice versa "inside - memory location".*** 

`uint` is an alias for uint256, a 256-bit unsigned integer.
```php
contract Example {
  // This will be stored permanently in the blockchain
  uint myUnsignedInteger = 100;

  function callme() {
    .....
  }
}
```

### Array
There are two types: `fixed` and `dynamic`.
We can declare an array as `public`, and Solidity will automatically create a **getter** method. Other contracts would then be able to read from, but not write to, this array. So this is a useful pattern for storing public data in your contract.
```php
Person[] public people;         //dynamic Array
```

### Function (private-internal/public-external)
In Solidity, functions are `public` by default (anyone (or any other contract) can call contract's function and execute its code). 

😱😱😱
🆘can vulnerable to attack 🆘

👉 Mark your functions as `private` by default, and then only make `public` the functions you want to expose to the world.
```php
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```
***💥 Using (_) in order to differentiate from global variables and declare private function***

Now **only** other functions **within** our contract will be able to call this function and add to the numbers array.

> ***👉 Note: If the function is set to `private`: Even though new contracts are inherited, function calls from this contracts cannot be made. If you want, let's use `internal`!!!***
#### Function modifiers
The function doesn't change state in Solidity — e.g. it doesn't change any values or write anything.

So in this case we could declare it as a `view` function, meaning it's only viewing the data but not modifying it:
```php
function sayHello() public view returns (string memory)
```
and `pure` 👉 you're not even accessing any data. This function doesn't even read from the state of the app.

> ***👉 Remember:***
> 
> ***1. `private` means it's only callable from other functions inside the contract; `internal` is like `private` but can also be called by contracts that inherit from this one; `external` can only be called outside the contract; and finally `public` can be called anywhere, both internally and externally.***
> 
> ***2. `view` tells us that by running the function, no data will be saved/changed. `pure` tells us that not only does the function not save any data to the blockchain, but it also doesn't read any data from the blockchain. Both of these don't cost any gas to call if they're called externally from outside the contract (but they do cost gas if called internally by another function).***

### Keccack256
Keccack256 is a version of SHA3, built-in Ethereum. This hash function only accepts a single input of type `bytes`.

👉👉👉 Must encode the variables first with `abi.encodePacked()`

Encoding  into binary representation using ***abi.encodePacked()*** ensures that the input passed to keccak256 is of the correct type.
```php
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("kimkhuongduy"));
```
> ***😱 Note: With strings, we have to compare their keccak256 hashes to check equality.***

### Events
`Events` are a way for your contract to communicate that something happened on the blockchain to your app front-end, which can be 'listening' for certain events and take action when they happen.
```php
// declare the event
event IntegersAdded(uint x, uint y, uint result);

function add(uint _x, uint _y) public returns (uint) {
  uint result = _x + _y;
  // fire an event to let the app know the function was called:
  emit IntegersAdded(_x, _y, result);
  return result;
}
```

### Mapping & Addresses
#### Address
The Ethereum blockchain is made up of `accounts`. Each account has an `address`. An address is owned by a **specific** user (or a smart contract).  An address in Solidity is a `160-bit` value that represents an Ethereum address, which is a unique identifier for an account on the Ethereum blockchain
#### Mapping
A mapping is a `key-value` store for storing and looking up data.
```php
// For a financial app, storing a uint that holds the user's account balance:
mapping (address => uint) public accountBalance;
// Or could be used to store / lookup usernames based on userId
mapping (uint => string) userIdToName;
```

### msg.sender
`msg.sender` which refers to the `address` of the person (or smart contract) who called the current function is a global variable (always available to all functions).
> Note: In Solidity, function execution always needs to start with an external caller. A contract will just sit on the blockchain doing nothing until someone calls one of its functions. So there will always be a msg.sender.
```php
mapping (address => uint) favoriteNumber;

function setMyNumber(uint _myNumber) public {
  // Update our `favoriteNumber` mapping to store `_myNumber` under `msg.sender`
  favoriteNumber[msg.sender] = _myNumber;
  // ^ The syntax for storing data in a mapping is just like with arrays
}

function whatIsMyNumber() public view returns (uint) {
  // Retrieve the value stored in the sender's address
  // Will be `0` if the sender hasn't called `setMyNumber` yet
  return favoriteNumber[msg.sender];
}
```
👉👉👉 Using `msg.sender` gives the security of the Ethereum blockchain — the only way someone can modify someone else's data would be to steal the private key associated with their Ethereum address.

### require
Using `require` the function will throw an error and stop executing if some condition is not true:
```php
function sayHiToVitalik(string memory _name) public returns (string memory) {
  // Compares if _name equals "Vitalik". Throws an error and exits if not true.
  // (Side note: Solidity doesn't have native string comparison, so we
  // compare their keccak256 hashes to see if the strings are equal)
  require(keccak256(abi.encodePacked(_name)) == keccak256(abi.encodePacked("Vitalik")));
  // If it's true, proceed with the function:
  return "Hi!";
}
```

### inheritance
Syntax
```php
ontract Doge {
  function catchphrase() public returns (string memory) {
    return "So Wow CryptoDoge";
  }
}

contract BabyDoge is Doge {
  function anotherCatchphrase() public returns (string memory) {
    return "Such Moon BabyDoge";
  }
}
```

### Data location (memory/storage/calldata)
There are two locations you can store variables — in `storage` and in `memory`. 
- ***Storage*** refers to variables stored permanently on the blockchain. 
- ***Memory*** variables are temporary, and are erased between external function calls to your contract.
> ***👉 Note: `calldata` is somehow similar to `memory`, but it's only available to `external` functions.***
```php
Zombie storage myZombie = zombies[_zombieId];
//myZombie is a pointer to zombie[_zombieId]

Zombie memory myZombie = zombies[_zombieId];
//myZombie is a copy of zombie[_zombieId]

//when data of pointer is changed -> this will permanently change 'zombie[_zombieId]' on the blockchain. Opposite case, no effect in case 'copy'.
```

### Internal/External
In addition to `public` and `private`, Solidity has two more types of visibility for functions: `internal` and `external`.
- ***internal*** is the same as ***private***, except that it's also accessible to contracts that inherit from this contract (if the function is private -> can not access from contracts which is inheritted).
- ***external*** is similar to ***public***, except that these functions can **ONLY** be called outside the contract — they can't be called by other functions inside that contract.

### Interacting with other contracts
For our contract to talk to another contract on the blockchain that we don't own, first we need to define an `interface`.
```php
//interface declaration
contract NumberInterface {
  function getNum(address _myAddress) public view returns (uint);
}

//how to use?
contract MyContract {
  address NumberInterfaceAddress = 0xab38...
  // ^ The address of the FavoriteNumber contract on Ethereum
  NumberInterface numberContract = NumberInterface(NumberInterfaceAddress);
  // Now `numberContract` is pointing to the other contract

  function someFunction() public {
    // Now we can call `getNum` from that contract:
    uint num = numberContract.getNum(msg.sender);
    // ...and do something with `num` here
  }
}
```
Declare `interface` similar to `contract` declaration, using keyword `contract`.

In this way, your contract can interact with any other contract on the Ethereum blockchain, as long they expose those functions as `public` or `external`.

### Immutability of Contracts
After deploying a contract to Ethereum, it’s `immutable`, which means that it can never be modified or updated again. The initial code you deploy to a contract is there to stay, permanently, on the blockchain. This is one reason security is such a huge concern in Solidity. If there's a flaw in your contract code, there's no way for you to patch it later. You would have to tell your users to start using a different smart contract address that has the fix.

But this is also a feature of smart contracts. `The code is law`. If you read the code of a smart contract and verify it, you can be sure that every time you call a function it's going to do exactly what the code says it will do. No one can later change that function and give you unexpected results.

### Ownable Contracts
If function is set `external`, so anyone can call it!!!!!😱

If you still want to set `external` for easily updating, but you want to limit access to it (maybe only the owner of that contract has special privileges), let's use `Ownable`.

Ownable is a contract (from OpenZeppelin). OpenZeppelin is a library of secure and community-vetted smart contracts. So the `Ownable contract` basically does the following:

1. When a contract is created, its constructor sets the `owner` to `msg.sender` (the person who deployed it)
2. It adds an `onlyOwner` modifier, which can restrict access to certain functions to only the `owner`
3. It allows you to transfer the contract to a new owner
> ***👉 Note: onlyOwner is such a common requirement for contracts that most Solidity DApps start with a copy/paste of this Ownable contract, and then their first contract inherits from it.***

### onlyOwner Function Modifier
A `function modifier` looks just like a function, but uses the keyword `modifier` instead of the keyword `function`. And it can't be called directly like a function can — instead we can attach the modifier's name at the end of a function definition to change that function's behavior.
```php
//modifier function
modifier onlyOwner() {
    require(isOwner());
    _;
}

//how to call modifier function
function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
}
```
Notice the `onlyOwner` modifier on the `renounceOwnership` function. When you call `renounceOwnership`, the code inside `onlyOwner` executes first. Then when it hits the `_;` statement in `onlyOwner`, it goes back and executes the code inside `renounceOwnership`.

So while there are other ways you can use modifiers, one of the most common use-cases is to add a quick `require` check before a function executes.

In the case of `onlyOwner`, adding this modifier to a function makes it so only the owner of the contract (you, if you deployed it) can call that function.

Function modifiers can also take arguments. For example:
```php
// A mapping to store a user's age:
mapping (uint => uint) public age;

// Modifier that requires this user to be older than a certain age:
modifier olderThan(uint _age, uint _userId) {
  require(age[_userId] >= _age);
  _;
}

// Must be older than 16 to drive a car (in the US, at least).
// We can call the `olderThan` modifier with arguments like so:
function driveCar(uint _userId) public olderThan(16, _userId) {
  // Some function logic
}
```

### Gas fee
In Solidity, your users have to pay every time they execute a function on your DApp using a currency called `gas`. How much gas is required to execute a function depends on how complex that function's logic is. Because running functions costs real money for your users, code optimization is much more important in Ethereum than in other programming languages.

⭕ Why is gas necessary?
The creators of Ethereum wanted to make sure someone couldn't clog up the network with an infinite loop, or hog all the network resources with really intensive computations. So they made it so transactions aren't free, and users have to pay for computation time as well as storage.
#### Struct packing to save gas
Normally there's no benefit to using these sub-types because Solidity reserves 256 bits of storage regardless of the `uint` size. For example, using `uint8` instead of `uint` (uint256) won't save you any gas.

But there's an exception to this: inside `structs`.

If you have multiple `uints` inside a struct, using a smaller-sized `uint` when possible will allow Solidity to pack these variables together to take up less storage. For example:
```php
struct NormalStruct {
  uint a;
  uint b;
  uint c;
}

struct MiniMe {
  uint32 a;
  uint32 b;
  uint c;
}

// `mini` will cost less gas than `normal` because of struct packing
NormalStruct normal = NormalStruct(10, 20, 30);
MiniMe mini = MiniMe(10, 20, 30); 
```
You'll also want to cluster identical data types together (i.e. put them next to each other in the struct) so that Solidity can minimize the required storage space. For example, a struct with fields `uint c; uint32 a; uint32 b;` will cost less gas than a struct with fields `uint32 a; uint c; uint32 b;` because the uint32 fields are clustered together.

### Time Units
The variable `now` will return the current unix timestamp of the latest block (the number of seconds that have passed since January 1st 1970).
> ***👉 Note: Unix time is traditionally stored in a 32-bit number.***

### Saving Gas With 'View' Functions
`view` functions don't cost any gas when they're called `externally` by a user.

This is because `view` functions don't actually change anything on the blockchain – they only read the data. So marking a function with `view` tells `web3.js` that it only needs to query your local Ethereum node to run the function, and it doesn't actually have to create a transaction on the blockchain (which would need to be run on every single node, and cost gas).

> ***👉 Note: If a `view` function is called internally from another function in the same contract that is not a `view` function, it will still cost gas. This is because the other function creates a transaction on Ethereum, and will still need to be verified from every node. So `view` functions are only free when they're called externally.***

### Storage is Expensive
One of the more expensive operations in Solidity is using `storage` — particularly writes. This is because every time you write or change a piece of data, it’s written permanently to the blockchain. Forever! Thousands of nodes across the world need to store that data on their hard drives, and this amount of data keeps growing over time as the blockchain grows.

In most programming languages, looping over large data sets is expensive. But in Solidity, this is way cheaper than using `storage` if it's in an `external view` function, since `view` functions don't cost your users any gas. (And gas costs your users real money!).

Declaring arrays in memory: 
```php
function getArray() external pure returns(uint[] memory) {
  // Instantiate a new array in memory with a length of 3
  uint[] memory values = new uint[](3);

  // Put some values to it
  values[0] = 1;
  values[1] = 2;
  values[2] = 3;

  return values;
}
```
The array will only exist until the end of the function call, and this is a lot cheaper gas-wise than updating an array in `storage` — free if it's a `view` function called externally.
> ***👉 Note: memory arrays must be created with a predefined length argument.***

### For Loops
The syntax of `for` loops in Solidity is similar to JavaScript
```php
function getEvens() pure external returns(uint[] memory) {
  uint[] memory evens = new uint[](5);
  // Keep track of the index in the new array:
  uint counter = 0;
  // Iterate 1 through 10 with a for loop:
  for (uint i = 1; i <= 10; i++) {
    // If `i` is even...
    if (i % 2 == 0) {
      // Add it to our array
      evens[counter] = i;
      // Increment counter to the next empty index in `evens`:
      counter++;
    }
  }
  return evens;
}
```
This function will return an array with the contents `[2, 4, 6, 8, 10]`.

### `payable` function 
Because the money ***(Ether)***, the data ***(transaction payload)***, and the contract code itself all live on Ethereum, it's possible for you to call a function and pay money to the contract at the same time.

A `payable` function is a special type of function that allows a smart contract to receive Ether as part of a transaction. `msg.value` is a special variable that refers to the amount of Ether being sent with a transaction. It is used in smart contract functions to determine the amount of Ether that is being sent to the contract, which can then be used for various purposes, such as charging fees or distributing tokens.
```php
pragma solidity ^0.8.0;

contract Example {
    function deposit() payable public {
        // Do something with the received Ether (msg.value)
    }
}
```

### Withdraws
😱 What happens after sending Ether to a contract????

After sending Ether to a contract, it gets stored in the contract's Ethereum account, and it will be **trapped** there — unless you add a function to **withdraw** the Ether from the contract.

We can write a function to withdraw Ether from the contract as follows:
```javascript
contract GetPaid is Ownable {
  function withdraw() external onlyOwner {
    address payable _owner = address(uint160(owner()));
    _owner.transfer(address(this).balance);
  }
}
```
Note that we're using `owner()` and `onlyOwner` from the `Ownable` contract, assuming that was imported.

It is important to note that you cannot transfer Ether to an address unless that address is of type `address payable`. But the `_owner` variable is of type `uint160`, meaning that we must explicitly cast it to `address payable`.

Once you cast the address from `uint160` to `address payable`, you can transfer Ether to that address using the `transfer` function, and `address(this).balance` will return the total balance stored on the contract. So if 100 users had paid 1 Ether to our contract, address(this).balance would equal 100 Ether.


















