const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width, canvas.height);

const gravity = 0.7;


// Cenário
const background = new Sprite({
    position: {x:0, y:0},
    imageSrc: "./img/background.png"
});

const shop = new Sprite({
    position: {x:200, y:186},
    imageSrc: "./img/shop.png",
    scale : 2.3,
    framesMax: 6
});


// Personagens
const player = new Fighter({
        position: {x: 140, y:0 },
        velocity: {x:0,y:0},
        color: "green",
        offset: {x: 0, y: 0},
        imageSrc: "./img/teste/Idle.png",
        scale : 2.5,
        framesMax: 8,
        offset: {x: 215, y:157},
        sprites: {
            idle: {imageSrc: "./img/samuraiMack/Idle.png", framesMax: 8, image: new Image()},
            run: {imageSrc: "./img/samuraiMack/Run.png", framesMax: 8, image: new Image()},
            jump: {imageSrc: "./img/samuraiMack/Jump.png", framesMax: 2, image: new Image()},
            fall: {imageSrc: "./img/samuraiMack/Fall.png", framesMax: 2, image: new Image()},
            attack1: {imageSrc: "./img/samuraiMack/Attack1.png", framesMax: 6, image: new Image()},
            takeHit: {imageSrc: "./img/samuraiMack/TakeHitWhiteSilhouette.png", framesMax: 4, image: new Image()},
            death: {imageSrc: "./img/samuraiMack/Death.png", framesMax: 6, image: new Image()}
        },
        attackBox: {
            offset: {x:110, y:50},
            width: 150,
            height: 50
        }
    });

const enemy = new Fighter({
    position: {x: 800, y:324 },
    velocity: {x:0,y:0},
    color: "yellow",
    offset: {x:-25, y: 10},
    imageSrc: "./img/kenji/Idle.png",
        scale : 2.5,
        framesMax: 4,
        offset: {x: 215, y:169},
        sprites: {
            idle: {imageSrc: "./img/kenji/Idle.png", framesMax: 4, image: new Image()},
            run: {imageSrc: "./img/kenji/Run.png", framesMax: 8, image: new Image()},
            jump: {imageSrc: "./img/kenji/Jump.png", framesMax: 2, image: new Image()},
            fall: {imageSrc: "./img/kenji/Fall.png", framesMax: 2, image: new Image()},
            attack1: {imageSrc: "./img/kenji/Attack1.png", framesMax: 4, image: new Image()},
            takeHit: {imageSrc: "./img/kenji/TakeHit.png", framesMax: 3, image: new Image()},
            death: {imageSrc: "./img/kenji/Death.png", framesMax: 7, image: new Image()}

    },
    attackBox: {
        offset: {x:-170, y:50},
        width: 170,
        height: 50
    }
});

var projectiles = [];

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
    
};

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0,0,canvas.width,canvas.height);
    
    background.update();
    shop.update();
    c.fillStyle = "rgba(255,255,255, 0.15)";
    c.fillRect(0,0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    projectiles.forEach(projectile => {
        if(projectile.shot){
            projectile.update();
            if(projectileCollision({rectangle1:projectile,rectangle2:projectile.enemy})){
                projectile.shot = false;
                console.log("asdsadasda");
            }
        }
        
    });
    

    player.velocity.x=0;
    enemy.velocity.x=0;

    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x=-5;
        player.switchSprite("run");
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
        player.switchSprite("run");
    }else{
        player.switchSprite("idle");
    }

    if(player.velocity.y < 0){
        player.switchSprite("jump");
    }else if(player.velocity.y > 0){
        player.switchSprite("fall");
    }


    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x=-5;
        enemy.switchSprite("run");
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
        enemy.switchSprite("run");
    }else{
        enemy.switchSprite("idle");
    }

    if(enemy.velocity.y < 0){
        enemy.switchSprite("jump");
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite("fall");
    }

    if( rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4){
            enemy.takeHit(10);
            player.isAttacking = false;
            gsap.to("#enemyHealth", {width: enemy.health+'%'});
    }

    if( rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2){
        player.takeHit(10);
        enemy.isAttacking = false;
        gsap.to("#playerHealth", {width: player.health+'%'});

    }

    // if misses

    if(player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    if(enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    if(enemy.health <= 0 || player.health <= 0){
        determineWinner(player, enemy, timerId);
    }
}

animate();

function rangedAttack(characterPosition, character){
    const posX = characterPosition.x;
    const posY = characterPosition.y;
    projectiles.push(new Projectile({position:{x:posX,y:posY}, offset: {x:90, y:70},
        width:10, height:5, velocity:8, direction:"r",shot:true, enemy:character}));
}

window.addEventListener('keydown', (event) => {

    //Player
    if(!player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if(player.groundTouched){
                    player.velocity.y = -15;
                    player.groundTouched = false;
                }
                break;
            case ' ':
                player.attack();
                rangedAttack(player.position, enemy);
                break;
        }
    }
    

    //Inimigo
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if(enemy.groundTouched){
                    enemy.velocity.y = -15;
                    enemy.groundTouched = false;
                }
                break;
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
    
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'w':
            keys.w.pressed = false;
            break;
    }
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
    }
})




