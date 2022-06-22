const crypto = require("crypto"); SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");
//create new object CryptoJS
//const SHA256 = require('crypto-js/sha256');
const hash = require('crypto-js/sha256');
//import elliptic lib
const ELLIPTIC = require('elliptic').ec, ec = new ELLIPTIC('secp256k1');
//create pairkey
const keyPair = ec.genKeyPair();
// public key: keyPair.getPublic("hex")
// private key: keyPair.getPrivate("hex")
const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic('hex');
const holderKeypair = ec.genKeyPair();

//create block
class Block{
    constructor(prevHash, data = []){
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.getHash();
        this.nonce = 0;
    }
    //cal hash value
    getHash(){
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.nonce).toString();
    }
    //PoW
    mine(difficulty){
        while(!this.hash.startsWith('0'.repeat(difficulty))){
            this.nonce++;
            this.hash = this.getHash();
        }
    }
    //check valid transaction of block
    HasValid_Transaction(chain){
        return this.data.every(transaction => transaction.isValid(transaction, chain));
    }
}
//create chain
class Blockchain{
    constructor(){
        const iniCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, holderKeypair.getPublic('hex'), 100000);
        //create genesisblock
        const genesisBlock = new Block('0000', [iniCoinRelease]);
        this.chain = [genesisBlock];
        //average time to generate block
        this.blocktime = 3000;
        this.difficulty = 1;
        //pool of waiting transaction
        this.transaction = [];
        //reward for mining
        this.reward = 197;
    }
    //get the last block
    get_lastBlok(){
        return this.chain[this.chain.length -1];
    }
    //add new block to the chain
    add_newBlok(newdata){
        const lastBlok = this.get_lastBlok();
        //new block contain: pre hash + new data
        const newBlok = new Block(lastBlok.hash, newdata);
        //measure mining time 
        console.log('==================================================================\nStart mining...');
        console.time('Time to mine');
        //mining
        newBlok.mine(this.difficulty);
        console.timeEnd('Time to mine');
        console.log('End mining\n', newBlok);
        //push new block to chain
        this.chain.push(newBlok);
        //change the difficult
        console.log('olddif: ', this.difficulty);
        this.difficulty += Date.now() - this.get_lastBlok().timeStamp.getTime() < this.blocktime ? 1 : -1;
        console.log('time: ', Date.now() - this.get_lastBlok().timeStamp.getTime());
        console.log('newdif: ', this.difficulty);
    }
    //check the modification of data
    isValid(blockchain = this){
        //block genesis blank -> count from block 1
        for(let i = 1; i < this.chain.length; i++){
            const curBlock = this.chain[i];
            const preBlock = this.chain[i-1];
    
            if( 
                curBlock.hash !== curBlock.getHash() || 
                curBlock.prevHash !== preBlock.hash || 
                !curBlock.HasValid_Transaction(blockchain)
            ){
                return false;
            }
        }
        return true;
    }
    //push transaction to pool
    add_newTransaction(transaction){
        if(transaction.isValid(transaction, this)){
            this.transaction.push(transaction);
        }
    }
    //transfer transactions from pool to chain and delete pool
    mineTransaction(rewardAddress){
        //gas fee for miner
        let gas = 0;
        this.transaction.forEach(transaction => {
            gas += transaction.gas;
        });
        //transaction reward to miner
        const newRewardtoMiner = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward + gas);
        newRewardtoMiner.signTransaction(MINT_KEY_PAIR);
        //pack the transaction rewward and all the transaction in pool
        this.add_newBlok([newRewardtoMiner, ...this.transaction]);
        this.transaction = [];
    }
    //cal account balance base on your history of transaction
    get_AccountBalance(address){
        let balance = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                //if you - sender
                if(transaction.from === address){
                    balance -= transaction.amount;
                    balance -= transaction.gas;
                }
                //receiver
                if(transaction.to === address){
                    balance += transaction.amount;
                }
            })
        });

        return balance;
    }
}
//create transaction
class Transaction{
    constructor(from, to, amount, gas = 0){
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.gas = gas;
    }
    //sign transaction 
    signTransaction(keyPair){
        if(keyPair.getPublic("hex") === this.from){
            this.signature = keyPair.sign(SHA256(this.from + this.to + this.amount + this.gas), "base64").toDER("hex");
        }
    }
    //check valid transaction
    isValid(transaction, chain){
        return(
            transaction.from &&
            transaction.to &&
            transaction.amount &&
            (chain.get_AccountBalance(transaction.from) >= transaction.amount + transaction.gas || transaction.from === MINT_PUBLIC_ADDRESS && transaction.amount == this.reward) && 
            ec.keyFromPublic(transaction.from, 'hex').verify(SHA256(transaction.from + transaction.to + transaction.amount + transaction.gas), transaction.signature)
        );
    }
}


const DCHAIN = new Blockchain();
const xxxwallet = ec.genKeyPair();
const transaction = new Transaction(holderKeypair.getPublic('hex'), xxxwallet.getPublic('hex'), 333, 56);
transaction.signTransaction(holderKeypair);

DCHAIN.add_newTransaction(transaction);
DCHAIN.mineTransaction(xxxwallet.getPublic('hex'));

console.log('ad hold: ', holderKeypair.getPublic('hex'));
console.log('ad mint: ', MINT_KEY_PAIR.getPublic('hex'));
console.log('your balance: ', DCHAIN.get_AccountBalance(holderKeypair.getPublic('hex')));
console.log('xxxad: ', xxxwallet.getPublic('hex'));
console.log('xxx: ', DCHAIN.get_AccountBalance(xxxwallet.getPublic('hex')));
