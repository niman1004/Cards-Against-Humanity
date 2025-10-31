import {io} from "socket.io-client"
const socket = io(import.meta.env.VITE_SOCKET_URL );


const registerListeners= (handlers)=>{
    socket.on("playerListUpdate" , handlers.onPlayerListUpdate);
    socket.on("newRound" , handlers.onNewRound);
    socket.on("updateHand" , handlers.onUpdateHand);
    socket.on("judgeRound" , handlers.onJudgeRound);
    socket.on("roundResult" , handlers.onRoundResult);
    socket.on("gameStarted" , handlers.onGameStarted);
    socket.on("submissionsUpdate" , handlers.onSubmissionsUpdate);
}

const emitJoinRoom= (roomCode , username)=>{
    socket.emit("joinRoom" , {roomCode , username} );
}

const emitStartGame = (roomCode)=>{
    socket.emit("startGame" , {roomCode});
}

const emitSubmitCard= (roomCode , card)=>{
    socket.emit("submitCard" , {roomCode , card});
}

const emitPickWinner = (roomCode , winnerId)=>{
    socket.emit("pickWinner" , {roomCode , winnerId});
}

export {
    socket , 
    registerListeners , 
    emitJoinRoom ,
    emitStartGame , 
    emitSubmitCard , 
    emitPickWinner,
};