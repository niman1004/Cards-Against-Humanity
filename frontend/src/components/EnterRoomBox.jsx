// EnterRoomBox.js
import{React , useEffect , useRef} from 'react'

function EnterRoomBox({ roomCode, setRoomCode, username, setUsername, onJoin }) {
  const isDisabled = !username.trim() || !roomCode.trim()

  //ADDING THE DVD ANIMATION
  const boxRef= useRef(null)
  const position= useRef({
    x:100, 
    y:100
  })

  const velocity= useRef({
    x:0.5,
    y:0.5 //change here
  })

  useEffect(()=>{
    let animationFrame;

    const animate=()=>{
      const box= boxRef.current
      if(!box) return
      const boxWidth= box.offsetWidth
      const boxHeight= box.offsetHeight

      const maxX= window.innerWidth - boxWidth
      const maxY= window.innerHeight - boxHeight
      
      position.current.x += velocity.current.x
      position.current.y+= velocity.current.y

      if(position.current.x <=0 || position.current.x >= maxX){
        velocity.current.x *= -1
      }

      if(position.current.y <=0 || position.current.y >= maxY){
        velocity.current.y *= -1
      }

      box.style.transform=`
        translate3d(${position.current.x}px , ${position.current.y}px , 0)
      `
      animationFrame= requestAnimationFrame(animate)
    }

    animationFrame= requestAnimationFrame(animate)
    return ()=> cancelAnimationFrame(animationFrame)
  } , []);

  return (
    <div ref={boxRef} className='fixed left-0 top-0  overflow-hidden'>
    <div className="border border-[#69396e] rounded-xl text-4xl p-8 flex flex-col items-center bg-[#101010] shadow-xl ">
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
    </div>
  )
}

export default EnterRoomBox
