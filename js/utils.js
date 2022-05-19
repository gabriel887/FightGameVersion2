
function rectangularCollision({rectangle1, rectangle2}){
    

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}

function projectileCollision({rectangle1, rectangle2}){
    // var base = rectangle1.position.x;
    // var ponta = rectangle1.position.x + rectangle1.width;
    // var basePessoa = rectangle2.position.x;
    // var pontaPessoa = rectangle2.position.x + rectangle2.width;
    // y*           *                           *       *
    
    
    //  *           *                           *       *
    // if(rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
    //     && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
    //     && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    //     && rectangle1.position.y <= rectangle2.position.y + rectangle2.height){
    // }
    
    return (((rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width) 
        && rectangle1.position.y + rectangle1.height >= rectangle2.position.y
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height));
}

function determineWinner(player1, player2, timerId){
    clearTimeout(timerId);
    document.querySelector("#resultado").style.display = "flex";
    if(player1.health === player2.health){
        document.querySelector("#resultado").innerHTML = "Empate. Decepcionante vocês.";       
    }else if(player1.health <= player2.health){
        document.querySelector("#resultado").innerHTML = "O jogador 2 Ganhou. Parabéns.";       
    }else if(player1.health >= player2.health){
        document.querySelector("#resultado").innerHTML = "O jogador 1 Ganhou. Parabéns.";       
    }
}

let timer = 120;
let timerId;
function decreaseTimer(){
    if(timer > 0){
        timer--;
        document.querySelector("#timer").innerHTML = timer;
        timerId = setTimeout(decreaseTimer, 1000);
    }
    if(timer === 0){
        determineWinner(player,enemy,timerId);
    }
}