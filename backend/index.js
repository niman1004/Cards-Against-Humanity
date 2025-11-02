import { createServer } from "http";
import { Server } from "socket.io";
import { Player, Room } from "./entities.js";
import express from "express"
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();


const app = express()
app.use(express.static("public"));

const PORT = process.env.PORT || 10000

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket" , "polling"],
  pingInterval: 25000,
  pingTimeout: 60000
});

const rooms = {};



io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // player joins a room
  socket.on("joinRoom", ({ roomCode, username, savedPlayerId }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = new Room(roomCode);
    }

    const room = rooms[roomCode];

    if (savedPlayerId) {
      const existingPlayer = room.players.find(p => p.playerId === savedPlayerId);
      if (existingPlayer) {
        if (existingPlayer.disconnectTimeout) {
          clearTimeout(existingPlayer.disconnectTimeout);
          existingPlayer.disconnectTimeout = null;
        }

        existingPlayer.socketId = socket.id;
        socket.join(roomCode);
        io.to(roomCode).emit("playerListUpdate", room.players)
        return;
      }
    }
    const playerId = crypto.randomUUID();
    const player = new Player(playerId, socket.id, username);
    rooms[roomCode].addPlayer(player);

    socket.join(roomCode);
    socket.emit("savePlayerId", playerId);
    io.to(roomCode).emit("playerListUpdate", room.players);
  });

  // start game
  socket.on("startGame", ({ roomCode }) => {
    const room = rooms[roomCode];
    room.startGame();
    io.to(roomCode).emit("gameStarted");
    io.to(roomCode).emit("newRound", {
      blackCard: room.currBlack,
      players: room.players.map((p) => ({
        playerId: p.playerId,
        socketId: p.socketId,
        name: p.name,
        isCzar: p.isCzar,
      })),
    });

    // send private hands
    room.players.forEach((p) => {
      io.to(p.socketId).emit("updateHand", p.hand);
    });
  });

  // submit card
  socket.on("submitCard", ({ roomCode, card }) => {
    const room = rooms[roomCode];
    const player = room.players.find((p) => p.socketId === socket.id);

    const index = player.hand.indexOf(card);
    if (index !== -1) player.hand.splice(index, 1);

    room.submissions.push({ card, socketId: player.socketId });

    // give new card
    player.hand.push(room.whiteDeck.pop());
    io.to(player.socketId).emit("updateHand", player.hand);

    //brodcasting submission process 
    io.to(roomCode).emit("submissionsUpdate", room.submissions)

    // check if all submitted
    if (room.submissions.length === room.players.length - 1) {
      const czar = room.players.find((p) => p.isCzar);
      io.to(czar.socketId).emit("judgeRound", room.submissions);
    }
  });

  // czar picks winner
  socket.on("pickWinner", ({ roomCode, winnerId, winningCard }) => {
    const room = rooms[roomCode];
    const winner = room.players.find((p) => p.socketId === winnerId);
    winner.score++;

    io.to(roomCode).emit("roundResult", {
      winner: winner.name,
      scores: room.players.map((p) => ({ name: p.name, score: p.score })),
      winningCard: winningCard

    });
    room.submissions = [];
    room.nextRound();

    io.to(roomCode).emit("newRound", {
      blackCard: room.currBlack,
      players: room.players.map((p) => ({
        playerId: p.playerId,
        socketId: p.socketId,
        name: p.name,
        isCzar: p.isCzar
      })),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
    //finding room to which this socket belonged to
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) continue;

      player.disconnectTimeout = setTimeout(() => {
        room.players = room.players.filter(p => p.playerId !== player.playerId);
        io.to(roomCode).emit("playerListUpdate", room.players);

        if (room.players.length === 0) {
          delete rooms[roomCode];
        }

        console.log("Removed player after timeout::", player.name);

      }, 6000);
      break;
    }
  })


});

httpServer.listen(PORT, () => {
  console.log(`Server up and running on ${PORT}`);
});
