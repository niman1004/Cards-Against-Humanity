import {io} from "socket.io-client"

let reconnectAttempts=0;
const maxReconAttempts= 15;
const baseDelay= 1000;

const socket = io(import.meta.env.VITE_SOCKET_URL , {
    transports:["websocket" , "polling"],
    reconnection: true, 
    reconnectionAttempts: maxReconAttempts,
    reconnectionDelay: baseDelay, 
    reconnectionDelayMax: 6000, 
    withCredentials: true
} );


const registerListeners= (handlers)=>{
    socket.on("playerListUpdate" , handlers.onPlayerListUpdate);
    socket.on("newRound" , handlers.onNewRound);
    socket.on("updateHand" , handlers.onUpdateHand);
    socket.on("judgeRound" , handlers.onJudgeRound);
    socket.on("roundResult" , handlers.onRoundResult);
    socket.on("gameStarted" , handlers.onGameStarted);
    socket.on("submissionsUpdate" , handlers.onSubmissionsUpdate);
    socket.on("savePlayerId" , handlers.onSavePlayerId)
}

const emitJoinRoom= (roomCode , username)=>{
    socket.emit("joinRoom" , {roomCode , username , savedPlayerId: localStorage.getItem("playerId")} );
}



const emitStartGame = (roomCode)=>{
    socket.emit("startGame" , {roomCode});
}

const emitSubmitCard= (roomCode , card)=>{
    socket.emit("submitCard" , {roomCode , card});
}

const emitPickWinner = (roomCode , winnerId , winningCard)=>{
    socket.emit("pickWinner" , {roomCode , winnerId , winningCard});
}

export {
    socket , 
    registerListeners , 
    emitJoinRoom ,
    emitStartGame , 
    emitSubmitCard , 
    emitPickWinner,
};