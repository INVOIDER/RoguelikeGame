import {map,mapWidth,mapHeight,enemies, startGame} from './index.js'
export class Enemy {
    constructor(x, y, health) {
      this.x = x;
      this.y = y;
      this.health = health;
      this.previousTile = { x: this.x, y: this.y, name: "floor" }
      this.strength = 20;
    }
    updateHPTile(){
        const healthBar = document.querySelector('.tileE .health')
        if(healthBar){
            const maxHealth = 50;
            const healthPercentage = (this.health / maxHealth) * 100;
            healthBar.style.width = healthPercentage + '%';
        }
    } 
    move(player){
        const randomDirection = this.getRandomDirection();
        const coordinates = this.getNewCoordinates(this.x, this.y, randomDirection);
        if (coordinates) {
            const { newX, newY } = coordinates;
            this.x = newX;
            this.y = newY;
            if(this.previousTile){
                map[this.previousTile.y][this.previousTile.x] = this.previousTile.name;
            }
            this.previousTile = { x: this.x, y: this.y, name: map[this.y][this.x] };
            map[this.y][this.x] = "enemy";
        }
    }

    
    getRandomDirection() {
        const directions = ["up", "down", "left", "right"];
        const randomIndex = Math.floor(Math.random() * directions.length);
        return directions[randomIndex];
      }
    getNewCoordinates(x, y, direction){
        let newX = x;
        let newY = y;
      
        switch (direction) {
          case "up":
            newY = Math.max(0, y - 1);
            break;
          case "down":
            newY = Math.min(mapHeight - 1, y + 1);
            break;
          case "left":
            newX = Math.max(0, x - 1);
            break;
          case "right":
            newX = Math.min(mapWidth - 1, x + 1);
            break;
          default:
            return null;
        }
      
        if (map[newY][newX] === "floor") {
          return { newX, newY };
        } else {
          return null;
        }
      };
      
    // attack(player) {
    //     console.log("Враг атаковал вас!");
    //     console.log("Ваш хп теперь: " + player.health)
    //     player.takeDamage(this.strength);
    //   }
    takeDamage(damage) {
      this.health -= damage;
      this.updateHPTile();
      if (this.health <= 0) {
        console.log("Враг побежден!");
        map[this.y][this.x] = 'floor';
        // Удаление врага из массива врагов
        const index = enemies.indexOf(this);
        if (index > -1) {
            enemies.splice(index, 1);
        }
        if(enemies.length == 0){
            alert('Вы выиграли!')
            startGame();
        }
      } else {
        console.log("Враг получил урон. Здоровье врага: " + this.health);
      }
    }
}