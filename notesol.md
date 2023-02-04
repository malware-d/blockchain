- [Contract](#contract)
- [State variables \& integers](#state-variables--integers)
- [Array](#array)
- [Function](#function)


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




