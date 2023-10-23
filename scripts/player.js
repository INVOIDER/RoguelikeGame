import {map,mapWidth,mapHeight,getEnemyAt,renderMap, startGame} from './index.js'
export class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.health = 100;
      this.strength = 20;
      this.previousTile = { x: this.x, y: this.y, name: "floor" }
    }
    updateHPTile(){
        const healthBar = document.querySelector('.field .tileP .health')
        if(healthBar){
            
            const maxHealth = 100;
            const healthPercentage = (this.health / maxHealth) * 100;
            healthBar.style.width = `${healthPercentage}%`;
            renderMap();
        }
    }  
    move(direction) {
      // реализация перемещения игрока
      switch (direction) {
        case "up":
          if (this.y > 0 && !isObstacleNext(this.y-1,this.x)) {
            this.y--;
          }
          break;
        case "down":
          if (this.y < mapHeight && !isObstacleNext(this.y+1,this.x)) {
            this.y++;
          }
          break;
        case "left":
          if (this.x > 0 && !isObstacleNext(this.y,this.x-1)) {
            this.x--;
          }
          break;
        case "right":
          if (this.x < mapWidth && !isObstacleNext(this.y,this.x+1)) {
            this.x++;
          }
          break;
      }
      function isObstacleNext(b,a){
        if(map[b][a]=="wall" || map[b][a]=="enemy"){
            return true
        }else{
            return false
        }
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
            this.previousTile = { x: this.x, y: this.y, name: map[this.y][this.x] };
        }else{
            this.previousTile = { x: this.x, y: this.y, name: "floor" };

        }
        map[this.y][this.x] = "player";
          
    }
    // Функция получения урона от врага
    takeDamage(damage) {
        // console.log("хп до снятия: " + this.health + " урон: " + damage + " " + typeof(damage))
        this.health -= damage;
        // console.log("хп после снятия: " + this.health)
        this.updateHPTile();
        if (this.health <= 0) {

          console.log("Игрок побежден!");
          alert("Вы проиграли!");
          startGame();
        } 
    }
    // Функция нанесения урона врагам
    attackNeighbours() {
        const neighbours = this.getNeighbourCoordinates();
        for (const { x, y } of neighbours) {
          const target = map[y][x];
          if (target === "enemy") {
            const enemy = getEnemyAt(x, y);
            enemy.takeDamage(this.strength);
            console.log("Новое ХП врага: " + enemy.health)
            enemy.canDamage = true;
            this.takeDamage(enemy.strength)
          }
        }
      }
      
    // Функция получения координат соседей
      getNeighbourCoordinates() {
        const neighbours = [];
        // Верхняя соседняя клетка
        if (this.y > 0 && map[this.y-1][this.x]=="enemy") {
          neighbours.push({ x: this.x, y: this.y - 1 });
        }
        // Нижняя соседняя клетка
        if (this.y < mapHeight - 1 && map[this.y+1][this.x]=="enemy") {
          neighbours.push({ x: this.x, y: this.y + 1 });
        }
        // Левая соседняя клетка
        if (this.x > 0 && map[this.y][this.x-1]=="enemy") {
          neighbours.push({ x: this.x - 1, y: this.y });
        }
        // Правая соседняя клетка
        if (this.x < mapWidth - 1 && map[this.y][this.x+1]=="enemy") {
          neighbours.push({ x: this.x + 1, y: this.y });
        }
      
        console.log("В данный момент у игрока: " + neighbours.length + " соседей")
        return neighbours;
      }  
  }
