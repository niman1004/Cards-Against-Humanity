import cards from "./cards";

function getCards(){
    let responses=[]

    for(let i=0; i<10; i++){
        const randomNumber = Math.floor(Math.random() * (1976 - 356 + 1)) + 356;
        responses.push(cards[randomNumber]);
    }
    return responses
}

export {getCards}