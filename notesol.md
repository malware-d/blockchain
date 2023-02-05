- [Contract](#contract)
- [State variables \& integers](#state-variables--integers)
- [Array](#array)
- [Function](#function)
  - [Function modifiers](#function-modifiers)
- [Keccack256](#keccack256)
- [Events](#events)
- [Mapping \& Addresses](#mapping--addresses)
  - [Address](#address)
  - [Mapping](#mapping)
- [msg.sender](#msgsender)
- [require](#require)
- [inheritance](#inheritance)
- [Data location](#data-location)
- [Internal/External](#internalexternal)

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

### Function
In Solidity, functions are `public` by default (anyone (or any other contract) can call contract's function and execute its code). 🆘can vulnerable to attack 🆘

👉 Mark your functions as `private` by default, and then only make `public` the functions you want to expose to the world.
```php
uint[] numbers;

function _addToArray(uint _number) private {
  numbers.push(_number);
}
```
***💥 Using (_) in order to differentiate from global variables and declare private function***

Now **only** other functions **within** our contract will be able to call this function and add to the numbers array.

> 👉 Note: If the function is set to `private`: Even though new contracts are inherited, function calls from this contracts cannot be made. If you want, let's use `internal`!!!
#### Function modifiers
The function doesn't change state in Solidity — e.g. it doesn't change any values or write anything.

So in this case we could declare it as a `view` function, meaning it's only viewing the data but not modifying it:
```php
function sayHello() public view returns (string memory)
```
and `pure` 👉 you're not even accessing any data. This function doesn't even read from the state of the app.

### Keccack256
Keccack256 is a version of SHA3, built-in Ethereum. This hash function only accepts a single input of type `bytes`.

👉👉👉 Must encode the variables first with `abi.encodePacked()`

Encoding  into binary representation using ***abi.encodePacked()*** ensures that the input passed to keccak256 is of the correct type.
```php
//6e91ec6b618bb462a4a6ee5aa2cb0e9cf30f7a052bb467b0ba58b8748c00d2e5
keccak256(abi.encodePacked("kimkhuongduy"));
```

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
The Ethereum blockchain is made up of `accounts`. Each account has an `address`. An address is owned by a **specific** user (or a smart contract)
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

### Data location
There are two locations you can store variables — in `storage` and in `memory`. 
- ***Storage*** refers to variables stored permanently on the blockchain. 
- ***Memory*** variables are temporary, and are erased between external function calls to your contract.
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











