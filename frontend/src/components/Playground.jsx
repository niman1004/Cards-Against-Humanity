import React , {useEffect , useState} from 'react'
import {
    socket , 
    registerListeners , 
    emitJoinRoom ,
    emitStartGame , 
    emitSubmitCard , 
    emitPickWinner,
} from "../controlers/socket.js"

function Playground() {
    const [roomCode , setRoomCode]= useState("TEST123");
    const [username , setUsername]= useState("");
    const [players , setPlayers]= useState([])
    const [hand , setHand]= useState([])
    const [blackCard , setBlackCard]= useState(null)
    const [submissions , setSubmissions]= useState([])
    const [isCzar , setIsCzar]= useState(false)
    const [logs , setLogs]= useState([])
    const [gameStarted , setGameStarted]= useState(false)

    useEffect(()=>{
        registerListeners({
            onPlayerListUpdate : (players)=>{
                setPlayers(players);
                log("players updated", players.map((p)=>p.name))
            } , 
            onGameStarted: ()=>{
                setGameStarted(true)
                log("game started for everyone!")
            },
            onNewRound: (data)=>{
                setBlackCard(data.blackCard);
                setPlayers(data.players);
                const me= data.players.find(p=>p.id===socket.id)
                setIsCzar(me?.isCzar || false)
                log("new round started" , data)
            },

            onUpdateHand: (hand)=>{
                setHand(hand);
                log("your hand updated" , hand);
            }, 

            onJudgeRound: (subs)=>{
                setSubmissions(subs);
                log("you are czar" , subs)
            }, 

            onRoundResult: (result)=>{
                log("round result" , result);
            }
        })

        return ()=>{
            socket.off()
        }
    } , []);
    function log(msg, data) {
        setLogs((prev) => [...prev, `${msg}: ${JSON.stringify(data)}`]);
        }
    function startGame(roomCode){
      emitStartGame(roomCode);
    }
  return (
    <div>
      <h1>PLAYGROUND- TESTING</h1>
      {!gameStarted &&(<div>
          <input className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500'  value={roomCode} onChange={(e)=>setRoomCode(e.target.value)}/>
      <input className='py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500'  value={username} onChange={(e)=>setUsername(e.target.value)}/>
      <button className="p-2 mr-2 bg-slate-400"  onClick={()=>emitJoinRoom(roomCode , username)}>join</button>
      <button  className='p-2 bg-green-400'   onClick={()=>startGame(roomCode)}>Start game</button>

      </div>)}
    
        <h2>ME</h2>
        <p>{username}</p>
        <p>{roomCode}</p>


      <h2>PLAYERS : {players.length}</h2>
      <ul>
        {players.map(p=>(
            <li key={p.id}>{p.name} {p.isCzar? "(Czar)" : ""}</li>
        ))}
      </ul>
{gameStarted && (<div>
      <h2 className='font-bold'>BLACK CARD</h2>
      <p className='bg-gray-600 text-white'>{blackCard || "none"}</p>

      {!isCzar && (
        <div>
        <h2>YOUR HAND</h2>
        {
            hand.map((c , i)=>{
                return (<button className='m-2 bg-slate-400 p-2' key={i} onClick={()=>emitSubmitCard(roomCode , c)}>
                    {c}
                </button>)
            })
        }
        </div>
        )}
      

      {isCzar && submissions.length >0 && (
        <div>
          <h2>Judge Submissions</h2>
          {submissions.map((s, i) => (
            <button className='m-2 bg-green-400 p-2'   key={i} onClick={() => emitPickWinner(roomCode, s.playerId)}>
              {s.card}
            </button>
          ))}
        </div>
      )}
</div>)}
       <pre className='flex flex-col border-solid border-black'>{logs.join("\n")}</pre>
   
    </div>
  )
}

export default Playground
