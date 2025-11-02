import {blackCards , whiteCards} from "./cards.js";

//player
 export class Player{
    constructor( playerId , socketId, name){
        this.socketId= socketId;
        this.playerId= playerId;// stored locally for reconnection
        this.name= name; 
        this.hand=[];
        this.score= 0;
        this.isCzar= false;
        this.disconnectTimeout= null;
    }
}

export class Room{
    constructor(roomCode){
        this.code= roomCode;
        this.players= [];
        this.blackDeck=shuffle([...blackCards]);
        this.whiteDeck=shuffle([...whiteCards]);
        this.submissions=[]; //round submissions
        this.currBlack= null;
        this.czarIndex=0;
        this.roundTimer= null;
    }

    addPlayer(player){
        this.players.push(player);
    }

    removePlayer(playerId){
        this.players= this.players.filter(p=> p.playerId!= playerId);
    }

    startGame(){
        this.dealHands();
        this.nextRound();
    }

    dealHands(){
        this.players.forEach(player=> {
            while(player.hand.length <7){
                player.hand.push(this.whiteDeck.pop());
            }
        });
    }

    nextRound(){
        this.players.forEach(p=> p.isCzar= false);
        this.players[this.czarIndex].isCzar=true;

        this.currBlack= this.blackDeck.pop();
        this.czarIndex=(this.czarIndex+1) % this.players.length;
        this.submissions=[];
    }

}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

