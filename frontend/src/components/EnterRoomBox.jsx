// EnterRoomBox.js
import React from 'react'

function EnterRoomBox({ roomCode, setRoomCode, username, setUsername, onJoin }) {
  const isDisabled = !username.trim() || !roomCode.trim()

  return (
    <div className="border border-[#69396e] rounded-xl text-4xl p-8 flex flex-col items-center bg-[#101010] shadow-xl w-[1000px]">
      <h1 className="font-semibold text-white mb-6 text-4xl text-center">
        Enter Room Code to join a game
      </h1>

      <div className="flex flex-col items-center gap-4">
        <input
          className="flex-1 border border-gray-500 rounded-lg text-4xl text-white placeholder-gray-400 p-3 bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#804385]"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full border border-gray-500 rounded-lg text-4xl text-white placeholder-gray-400 p-3 bg-[#181818] focus:outline-none focus:ring-2 focus:ring-[#804385]"
          placeholder="ROOM123"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          className={`px-6 py-3 rounded-lg font-semibold text-4xl transition-colors
            ${isDisabled 
              ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
              : "bg-[#804385] text-white hover:bg-[#69396e]"
            }`}
          onClick={onJoin}
          disabled={isDisabled}
        >
          Join
        </button>
      </div>
    </div>
  )
}

export default EnterRoomBox
