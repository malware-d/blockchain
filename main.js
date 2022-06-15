const {Block, Blockchain} = require ("./simpleBlockchainJS");
const DCHAIN = new Blockchain(4);
console.log(DCHAIN);

DCHAIN.add_newBlok({
    from: "me",
    to: "her",
    amout: "1000"
})
DCHAIN.add_newBlok({
    from: "her",
    to: "me",
    amount: "3000"
})

console.log(DCHAIN.chain);
