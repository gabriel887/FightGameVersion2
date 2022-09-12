class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, reversedImage = false, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50,
            this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 13;
        this.reversedImage = reversedImage;
        this.offset = offset;
    }

    drawCharacter() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale);
    }

    animateFrames() {
        if (this.reversedImage) {
            this.framesElapsed++;
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent != 0) {
                    this.framesCurrent--;
                } else {
                    this.framesCurrent = this.framesMax - 1;
                }
            }
        } else {
            this.framesElapsed++;
            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++;
                } else {
                    this.framesCurrent = 0;
                }
            }
        }
    }

    update() {
        this.drawCharacter();
        this.animateFrames();

    }
}

class Fighter extends Sprite {

    constructor({
        position,
        side,
        velocity,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });

        this.velocity = velocity;
        this.width = 50,
            this.height = 150;
        this.lastKey;
        this.groundTouched = true;
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset
        }
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 7;
        this.sprites = sprites;
        this.dead = false;
        this.rangedAttacked = false;
        this.side = side;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

    }

    update() {
        this.drawCharacter();

        if (!this.dead) this.animateFrames();

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        //atack boxes
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;

        if (this.position.y + this.height + this.velocity.y >= (canvas.height - 96)) {
            this.velocity.y = 0;
            this.position.y = 330;
            this.groundTouched = true;
        } else {
            this.velocity.y += gravity;
        }

    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.switchSprite("death");
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        //overriding all other animations
        if (this.image === this.sprites.deathToLeft.image) {
            if (this.sprites.deathToLeft.reversedImage) {
                if (this.framesCurrent === 0) {
                    this.dead = true;
                }
            } else {
                if (this.framesCurrent === this.sprites.deathToLeft.framesMax - 1) {
                    this.dead = true;
                }
            }
            return;
        }
        if (this.image === this.sprites.deathToRight.image) {
            if (this.sprites.deathToRight.reversedImage) {
                if (this.framesCurrent === 0) {
                    this.dead = true;
                }
            } else {
                if (this.framesCurrent === this.sprites.deathToRight.framesMax - 1) {
                    this.dead = true;
                }
            }
            return;
        }

        if (this.image === this.sprites.attack1ToLeft.image) {
            if (this.sprites.attack1ToLeft.reversedImage) {
                if (this.framesCurrent != 0) {
                    return;
                }
            } else {
                if (this.framesCurrent < this.sprites.attack1ToLeft.framesMax - 1) {
                    return;
                }
            }
        }
        if (this.image === this.sprites.attack1ToRight.image) {
            if (this.sprites.attack1ToRight.reversedImage) {
                if (this.framesCurrent != 0) {
                    return;
                }
            } else {
                if (this.framesCurrent < this.sprites.attack1ToRight.framesMax - 1) {
                    return;
                }
            }
        }

        if (this.image === this.sprites.takeHitToLeft.image) {
            if (this.sprites.takeHitToLeft.reversedImage) {
                if (this.framesCurrent != 0) {
                    return;
                }
            } else {
                if (this.framesCurrent < this.sprites.takeHitToLeft.framesMax - 1) {
                    return;
                }
            }
        }

        if (this.image === this.sprites.takeHitToRight.image) {
            if (this.sprites.takeHitToRight.reversedImage) {
                if (this.framesCurrent != 0) {
                    return;
                }
            } else {
                if (this.framesCurrent < this.sprites.takeHitToRight.framesMax - 1) {
                    return;
                }
            }
        }

        switch (sprite) {
            case 'idle':
                if (this.side === "R") {
                    if (this.image !== this.sprites.idleToRight.image) {
                        this.image = this.sprites.idleToRight.image;
                        this.framesMax = this.sprites.idleToRight.framesMax;
                        this.framesCurrent = this.sprites.idleToRight.reversedImage ? this.sprites.idleToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.idleToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.idleToLeft.image) {
                        this.image = this.sprites.idleToLeft.image;
                        this.framesMax = this.sprites.idleToLeft.framesMax;
                        this.framesCurrent = this.sprites.idleToLeft.reversedImage ? this.sprites.idleToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.idleToLeft.reversedImage;
                    }
                }
                break;
            case 'run':
                if (this.side === "R") {
                    if (this.image !== this.sprites.runToRight.image) {
                        this.image = this.sprites.runToRight.image;
                        this.framesMax = this.sprites.runToRight.framesMax;
                        this.framesCurrent = this.sprites.runToRight.reversedImage ? this.sprites.runToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.runToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.runToLeft.image) {
                        this.image = this.sprites.runToLeft.image;
                        this.framesMax = this.sprites.runToLeft.framesMax;
                        this.framesCurrent = this.sprites.runToLeft.reversedImage ? this.sprites.runToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.runToLeft.reversedImage;
                    }
                }

                break;
            case 'jump':
                if (this.side === "R") {
                    if (this.image !== this.sprites.jumpToRight.image) {
                        this.image = this.sprites.jumpToRight.image;
                        this.framesMax = this.sprites.jumpToRight.framesMax;
                        this.framesCurrent = this.sprites.jumpToRight.reversedImage ? this.sprites.jumpToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.jumpToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.jumpToLeft.image) {
                        this.image = this.sprites.jumpToLeft.image;
                        this.framesMax = this.sprites.jumpToLeft.framesMax;
                        this.framesCurrent = this.sprites.jumpToLeft.reversedImage ? this.sprites.jumpToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.jumpToLeft.reversedImage;
                    }
                }

                break;
            case 'fall':
                if (this.side === "R") {
                    if (this.image !== this.sprites.fallToRight.image) {
                        this.image = this.sprites.fallToRight.image;
                        this.framesMax = this.sprites.fallToRight.framesMax;
                        this.framesCurrent = this.sprites.fallToRight.reversedImage ? this.sprites.fallToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.fallToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.fallToLeft.image) {
                        this.image = this.sprites.fallToLeft.image;
                        this.framesMax = this.sprites.fallToLeft.framesMax;
                        this.framesCurrent = this.sprites.fallToLeft.reversedImage ? this.sprites.fallToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.fallToLeft.reversedImage;
                    }
                }

                break;

            case 'attack1':
                if (this.side === "R") {
                    if (this.image !== this.sprites.attack1ToRight.image) {
                        this.image = this.sprites.attack1ToRight.image;
                        this.framesMax = this.sprites.attack1ToRight.framesMax;
                        this.framesCurrent = this.sprites.attack1ToRight.reversedImage ? this.sprites.attack1ToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.attack1ToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.attack1ToLeft.image) {
                        this.image = this.sprites.attack1ToLeft.image;
                        this.framesMax = this.sprites.attack1ToLeft.framesMax;
                        this.framesCurrent = this.sprites.attack1ToLeft.reversedImage ? this.sprites.attack1ToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.attack1ToLeft.reversedImage;

                    }
                }

                break;

            case 'takeHit':
                if (this.side === "R") {
                    if (this.image !== this.sprites.takeHitToRight.image) {
                        this.image = this.sprites.takeHitToRight.image;
                        this.framesMax = this.sprites.takeHitToRight.framesMax;
                        this.framesCurrent = this.sprites.takeHitToRight.reversedImage ? this.sprites.takeHitToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.takeHitToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.takeHitToLeft.image) {
                        this.image = this.sprites.takeHitToLeft.image;
                        this.framesMax = this.sprites.takeHitToLeft.framesMax;
                        this.framesCurrent = this.sprites.takeHitToLeft.reversedImage ? this.sprites.takeHitToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.takeHitToLeft.reversedImage;
                    }
                }

                break;

            case 'death':
                if (this.side === "R") {
                    if (this.image !== this.sprites.deathToRight.image) {
                        this.image = this.sprites.deathToRight.image;
                        this.framesMax = this.sprites.deathToRight.framesMax;
                        this.framesCurrent = this.sprites.deathToRight.reversedImage ? this.sprites.deathToRight.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.deathToRight.reversedImage;
                    }
                } else {
                    if (this.image !== this.sprites.deathToLeft.image) {
                        this.image = this.sprites.deathToLeft.image;
                        this.framesMax = this.sprites.deathToLeft.framesMax;
                        this.framesCurrent = this.sprites.deathToLeft.reversedImage ? this.sprites.deathToLeft.framesMax - 1 : 0;
                        this.reversedImage = this.sprites.deathToLeft.reversedImage;
                    }
                }

                break;
        }
    }
}

class Projectile extends Sprite {
    constructor({
        position,
        AttackOffset,
        offset,
        width,
        height,
        velocity,
        direction,
        shot = false,
        hitted = false,
        enemy,
        imageSrc = "./img/ranger2/ArrowMove.png",
        scale = 2,
        framesMax = 2
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
        this.AttackOffset = AttackOffset;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
        this.direction = direction;
        this.hitted = hitted;
        this.shot = shot;
        this.enemy = enemy;
        
    }

    update() {
        this.imageSrc = this.direction === "R" ? "./img/ranger2/ArrowMove.png" : "./img/ranger2/ArrowMoveToLeft.png";
        this.reversedImage = (this.direction === "R" ? false : true) ;
        if (this.shot) {
            this.drawCharacter();
            this.animateFrames();
            if (this.direction === "R") {
                this.position.x += this.velocity;
            } else {
                this.position.x -= this.velocity;
            }
        }
    }

}