import {map,mapWidth,mapHeight} from './index.js'
export class Enemy {
    constructor(x, y, health) {
      this.x = x;
      this.y = y;
      this.health = health;
      this.previousTile = { x: this.x, y: this.y, name: "floor" }
    }
    move(){
        const randomDirection = this.getRandomDirection();
        const coordinates = this.getNewCoordinates(this.x, this.y, randomDirection);
        if (coordinates) {
            const { newX, newY } = coordinates;
            if(this.previousTile){
                map[this.previousTile.y][this.previousTile.x] = this.previousTile.name;
            }
            this.previousTile = { x: this.x, y: this.y, name: map[this.y][this.x] };
            this.x = newX;
            this.y = newY;
            map[this.y][this.x] = "enemy";
        }
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
      
    attack(player) {
        console.log("Враг атаковал игрока!");
        player.takeDamage(this.strength);
      }
    takeDamage(damage) {
      this.health -= damage;
      if (this.health <= 0) {
        console.log("Враг побежден!");
        // Дополнительный код для удаления врага с карты
      } else {
        console.log("Враг получил урон. Здоровье врага: " + this.health);
      }
    }
}