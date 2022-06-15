//create new object CryptoJS
const hash = require('crypto-js/sha256');

//create block
class Block {
    constructor(prevHash, data) {
        this.prevHash = prevHash;
        this.data = data;
        this.timeStamp = new Date();
        this.hash = this.getHash();
        this.nonce = 0;
    }
    //cal hash value
    getHash() {
        return hash(this.prevHash + JSON.stringify(this.data) + this.timeStamp + this.nonce).toString();
    }
    //PoW
    mine(difficulty){
        while(!this.hash.startsWith('0'.repeat(difficulty))){
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

class Blockchain{
    constructor(difficulty){
        //create genesisblock
        const genesisBlock = new Block('0000', {
            isGenesis : false
        })
        this.difficulty = difficulty;
        //array chain
        this.chain = [genesisBlock];
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
        newBlok.mine(this.difficulty);
        console.timeEnd('Time to mine');
        console.log('End mining\n', newBlok);
        this.chain.push(newBlok);
    }
    //check the modification of data
    isValid(){
        //block genesis blank -> count from block 1
        for(let i = 1; i < this.chain.length; i++){
            const curBlock = this.chain[i];
            const preBlock = this.chain[i-1];
    
            if(curBlock.hash !== curBlock.getHash() || curBlock.prevHash !== preBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports = {Block, Blockchain};