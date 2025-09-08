import { createServer } from "http";
import { Server } from "socket.io";
import { Player, Room } from "./entities.js";
import express from "express"

const app= express()
app.use(express.static("public"));



const httpServer = createServer(app);
const io = new Server(httpServer, {
     cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {};



io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // player joins a room
  socket.on("joinRoom", ({ roomCode, username }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = new Room(roomCode);
    }

    const player = new Player(socket.id, username);
    rooms[roomCode].addPlayer(player);

    socket.join(roomCode);

    io.to(roomCode).emit("playerListUpdate", rooms[roomCode].players);
  });

  // start game
  socket.on("startGame", ({ roomCode }) => {
    const room = rooms[roomCode];
    room.startGame();
    io.to(roomCode).emit("gameStarted");
    io.to(roomCode).emit("newRound", {
      blackCard: room.currBlack,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        isCzar: p.isCzar,
      })),
    });

    // send private hands
    room.players.forEach((p) => {
      io.to(p.id).emit("updateHand", p.hand);
    });
  });

  // submit card
  socket.on("submitCard", ({ roomCode, card }) => {
    const room = rooms[roomCode];
    const player = room.players.find((p) => p.id === socket.id);

    const index = player.hand.indexOf(card);
    if (index !== -1) player.hand.splice(index, 1);

    room.submissions.push({ card, playerId: player.id });

    // give new card
    player.hand.push(room.whiteDeck.pop());
    io.to(player.id).emit("updateHand", player.hand);

    // check if all submitted
    if (room.submissions.length === room.players.length - 1) {
      const czar = room.players.find((p) => p.isCzar);
      io.to(czar.id).emit("judgeRound", room.submissions);
    }
  });

  // czar picks winner
  socket.on("pickWinner", ({ roomCode, winnerId }) => {
    const room = rooms[roomCode];
    const winner = room.players.find((p) => p.id === winnerId);
    winner.score++;

    io.to(roomCode).emit("roundResult", {
      winner: winner.name,
      scores: room.players.map((p) => ({ name: p.name, score: p.score })),
    });

    room.nextRound();

    io.to(roomCode).emit("newRound", {
      blackCard: room.currBlack,
      players: room.players.map((p) => ({
        id: p.id,
        name: p.name,
        isCzar: p.isCzar,
      })),
    });
  });
});

httpServer.listen(3000, () => {
  console.log("server is running on port 3000");
});
