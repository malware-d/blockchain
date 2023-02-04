- [Contract](#contract)
- [State variables \& integers](#state-variables--integers)
- [Array](#array)
- [Function](#function)
  - [Function modifiers](#function-modifiers)
- [Keccack256](#keccack256)
- [Events](#events)


### Contract
Solidity's code is encapsulated in `contracts`. A **contract** is the fundamental building block of Ethereum applications — all variables and functions belong to a contract. All solidity source code should start with a "version pragma" — a declaration of the version of the Solidity compiler this code should use.
```php
pragma solidity >=0.5.0 <0.6.0;

contract HelloWorld {

}
```

### State variables & integers
`State variables` are permanently stored in contract storage (written to the Ethereum blockchain). ***All variables decleared outside the function are state.*** 

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

Now **only** other functions within our contract will be able to call this function and add to the numbers array.
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







