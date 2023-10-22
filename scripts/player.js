import {map,mapWidth,mapHeight} from './index.js'
export class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.health = 50;
      this.strength = 20;
      this.previousTile = { x: this.x, y: this.y, name: "floor" }
    }
    updateHPTile(){
        const healthBar = document.querySelector('.tileP .health')
        if(healthBar){
            healthBar.style.width = this.health + '%';
        }
    }  
    move(direction) {
      // реализация перемещения игрока
      switch (direction) {
        case "up":
          if (this.y > 0) {
            console.log("Старые координаты игрока: x=" + this.x + " y = " + this.y)
            this.y--;
          }
          break;
        case "down":
          if (this.y < mapHeight) {
            this.y++;
          }
          break;
        case "left":
          if (this.x > 0) {
            this.x--;
          }
          break;
        case "right":
          if (this.x < mapWidth) {
            this.x++;
          }
          break;
      }
        switch (map[this.y][this.x]) {    // реализация взаимодействия игрока с объектами на карте
            case "healthKit":
                this.changePrevTile(this.health >=100 ? 'HP' : null)
                const hpBonus = 20;
                this.health = this.health + hpBonus >=100 ? 100 : this.health + hpBonus
                this.updateHPTile();
                console.log("Вы подобрали аптечку! Ваше здоровье: " + this.health);
                map[this.y][this.x] = "player";
                break;
            case "sword":
                this.changePrevTile();
                const attackBonus = 20;
                this.strength+=attackBonus
                console.log("Вы подобрали меч! Ваша атака увеличена на: " + attackBonus);
                map[this.y][this.x] = "player";
                break;
            case "enemy":
              console.log("Вы атаковали врага! Ваше здоровье: " + this.health);
              map[this.y][this.x] = "player";
              break;
            case "floor":
                this.changePrevTile();
                map[this.y][this.x] = "player";
          }
    }
    changePrevTile(name){
        if(this.previousTile){
            map[this.previousTile.y][this.previousTile.x] = this.previousTile.name;
        }
        if (name =="HP"){
            console.log("Вы встали на хп")
            this.previousTile = { x: this.x, y: this.y, name: map[this.y][this.x] };
        }else{
            this.previousTile = { x: this.x, y: this.y, name: "floor" };

        }
        map[this.y][this.x] = "player";
          
    }
    // Функция получения урона от врага
    takeDamage(damage) {
        this.health -= damage;
        updateHPTile();
        if (this.health <= 0) {
          console.log("Игрок побежден!");
          alert("Вы проиграли!")
        } else {
          console.log("Игрок получил урон. Здоровье игрока: " + this.health);
        }
      }

    // Функция нанесения урона врагам
    attackNeighbours() {
        const neighbours = this.getNeighbourCoordinates();
        for (const { x, y } of neighbours) {
          const target = map[y][x];
          if (target instanceof Enemy) {
            console.log("Вы атаковали врага на клетке " + x + ", " + y + "!");
            target.takeDamage(this.strength);
          }
        }
      }
    // Функция получения координат соседей
      getNeighbourCoordinates() {
        const neighbours = [];
      
        // Верхняя соседняя клетка
        if (this.y > 0) {
          neighbours.push({ x: this.x, y: this.y - 1 });
        }
        // Нижняя соседняя клетка
        if (this.y < mapHeight - 1) {
          neighbours.push({ x: this.x, y: this.y + 1 });
        }
        // Левая соседняя клетка
        if (this.x > 0) {
          neighbours.push({ x: this.x - 1, y: this.y });
        }
        // Правая соседняя клетка
        if (this.x < mapWidth - 1) {
          neighbours.push({ x: this.x + 1, y: this.y });
        }
      
        return neighbours;
      }  
  }
  