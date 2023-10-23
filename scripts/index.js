import {Player} from './player.js' //Подключаем класс игрока
import { Enemy } from './enemy.js';//Подключаем класс врага
// Создание двухмерного массива карты
export const mapWidth = 40;
export const mapHeight = 24;
export let enemies = []
export let map = new Array(mapHeight).fill(null).map(() => new Array(mapWidth).fill("wall"));

window.startGame = startGame;
let player;
export function startGame() {
    if (player) {
      player.x = 0;
      player.y = 0;
      player.health = 100;
      player.strength = 20;
      player.previousTile = { x: 0, y: 0, name: "floor" };
    }  
  enemies.splice(0, enemies.length);
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        map[y][x] = "wall";
      }
    }

  generateMap();
  document.addEventListener("keydown", handleKeyPress);
}

// Генерация случайных прямоугольных комнат
function generateRooms(minSize, maxSize, minCount, maxCount) {
  let roomCount = getRandomNumber(minCount, maxCount);
  let prevStartX, prevStartY, prevRoomWidth, prevRoomHeight;

  for (let i = 0; i < roomCount; i++) {
    const roomWidth = getRandomNumber(minSize, maxSize);
    const roomHeight = getRandomNumber(minSize, maxSize);
    const startX = getRandomNumber(0, mapWidth - roomWidth);
    const startY = getRandomNumber(0, mapHeight - roomHeight);

    for (let y = startY; y < startY + roomHeight; y++) {
      for (let x = startX; x < startX + roomWidth; x++) {
        map[y][x] = "floor";
      }
    }

    // Генерация коридора через каждую комнату
    const centerX = startX + Math.floor(roomWidth / 2);
    const centerY = startY + Math.floor(roomHeight / 2);
    map[centerY][centerX] = "floor";

    // Генерация коридора, соединяющего предыдущую комнату с текущей
    if (i > 0) {
      const prevCenterX = prevStartX + Math.floor(prevRoomWidth / 2);
      const prevCenterY = prevStartY + Math.floor(prevRoomHeight / 2);
      let corridorStartX = prevCenterX;
      let corridorStartY = prevCenterY;

      while (corridorStartX !== centerX) {
        const directionX = corridorStartX < centerX ? 1 : -1;
        corridorStartX += directionX;
        map[corridorStartY][corridorStartX] = "floor";
      }

      while (corridorStartY !== centerY) {
        const directionY = corridorStartY < centerY ? 1 : -1;
        corridorStartY += directionY;
        map[corridorStartY][corridorStartX] = "floor";
      }
    }

    prevStartX = startX;
    prevStartY = startY;
    prevRoomWidth = roomWidth;
    prevRoomHeight = roomHeight;
  }
}


function generateCorridors(minCount, maxCount) {
  const corridorCount = getRandomNumber(minCount, maxCount);
  for (let i = 0; i < corridorCount; i++) {
    // Генерация коридора
    let intersectsRoom = false;
    let startX, startY, endX, endY;
    
    const isVertical = Math.random() < 0.5;
    const maxEndCoord = isVertical ? mapHeight - 1 : mapWidth - 1;
    const corridorLength = getRandomNumber(2, maxEndCoord);

    

    if (isVertical) {
      startX = getRandomNumber(1, mapWidth - 2);
      startY = getRandomNumber(0, mapHeight - corridorLength);
      endX = startX;
      endY = startY + corridorLength;
    } else {
      startX = getRandomNumber(0, mapWidth - corridorLength);
      startY = getRandomNumber(1, mapHeight - 2);
      endX = startX + corridorLength;
      endY = startY;
    }

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (map[y][x] === "floor") {
          intersectsRoom = true;
          break;
        }
      }
      if (intersectsRoom) break;
    }
   
  }
}

// Вспомогательная функция для генерации случайного числа в заданном диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateItems(healthKitCount,swordsCount){ 
  //Генерация аптечек
  for (let i=0;i<healthKitCount;i++){
      let y =0
      let x = 0
      do{
          y = getRandomNumber(0,mapHeight - 1)
          x = getRandomNumber(0,mapWidth - 1)
          console.log(map[y][x])
      }while(map[y][x]!="floor");
      map[y][x]="healthKit";
  }
//Генерация мечей
  for (let i=0;i<swordsCount;i++){
    let y =0
    let x = 0
    do{
        y = getRandomNumber(0,mapHeight - 1)
        x = getRandomNumber(0,mapWidth - 1)
        console.log(map[y][x])
    }while(map[y][x]!="floor");
    map[y][x]="sword";
}
}

function generateEnemies(enemiesCount){
  for (let i=0;i<enemiesCount;i++){
      let y =0
      let x = 0
      do{
          y = getRandomNumber(0,mapHeight - 1)
          x = getRandomNumber(0,mapWidth - 1)
      }while(map[y][x]!="floor");
      const enemy = new Enemy(x, y, 50);  
      enemies.push(enemy);
      map[y][x]="enemy";
    }  
}

function generatePlayer(){
    let y =0
    let x = 0
      do{
          y = getRandomNumber(0,mapHeight - 1)
          x = getRandomNumber(0,mapWidth - 1)
          console.log(map[y][x])
      }while(map[y][x]!="floor");
      map[y][x]="player";
      return new Player(x, y);
}

export function getEnemyAt(x, y) {
  // Проходим по массиву врагов и проверяем координаты каждого врага
  for (const enemy of enemies) {
    if (enemy.x === x && enemy.y === y) {
      return enemy; // Возвращаем врага с указанными координатами
    }
  }
  return null; // Если враг с указанными координатами не найден, возвращаем null
}
function handleKeyPress(event) {
  const keyPressed = event.code;

  switch (keyPressed) {
    case "KeyW":
      player.move("up",map);
      moveEnemies()
      renderMap();
      break;
    case "KeyS":
      player.move("down",map);
      moveEnemies()
      renderMap();
      break;
    case "KeyA":
      player.move("left",map);
      moveEnemies()
      renderMap();
      break;
    case "KeyD":
      player.move("right",map);
      moveEnemies()
      renderMap();
      break;
    case "Space":
      player.attackNeighbours();
      moveEnemies()
      renderMap();
      break;
  }
}
// Генерация карты
function generateMap() {
  // Заполняем всю карту стеной
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      map[y][x] = "wall";
    }
  }
  // Генерируем комнаты
  generateRooms(3, 8, 5, 10);

  // Генерируем проходы
  generateCorridors(3, 5);

  generateItems(10,2);
  generateEnemies(10);
  //Создаём игрока
  player = generatePlayer();
  renderMap();
}

//Функция отрисовки карты
export function renderMap(){ 
  const fieldElement = document.querySelector(".field");
  fieldElement.innerHTML = "";
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileElement = document.createElement("div");

      switch(map[y][x]){
        case 'player':
          tileElement.className = 'tileP'
          const healthBar = document.createElement('div');
          healthBar.className = 'health';
          tileElement.appendChild(healthBar);
          break
        case 'enemy':
          tileElement.className = 'tileE'
          const enemyHealthBar = document.createElement('div');
          enemyHealthBar.className = 'health';
          tileElement.appendChild(enemyHealthBar);
          break 
        case 'healthKit':
          tileElement.className = 'tileHP'
          break
        case 'sword':
          tileElement.className = 'tileSW'
          break
        case 'wall':
          tileElement.className = "tileW"
          break
        case 'floor':
          tileElement.className = 'tile'
          break
      }
      // tileElement.className = map[y][x] === "wall" ? "tileW" : "tile";
      fieldElement.append(tileElement);
      const infoElement = document.querySelector(".info")
      infoElement.innerHTML = `${player.health} HP  ${player.strength} atk`
    }
  }
}
//Функция случайного передвижения врагов
let hasAttacked = false;
function moveEnemies(){ 
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (map[i][j] === "enemy") {
        const enemy = getEnemyAt(j, i);
        if(enemy){
          if (isPlayerNextTo(j, i) && !hasAttacked) {
            // enemy.attack(player); 
            player.takeDamage(enemy.strength)
            hasAttacked = true;
        }else{
          enemy.move(player);
        }
        }
      }
    }
  }
}
function isPlayerNextTo(x, y) {
  const neighbours = player.getNeighbourCoordinates();
  for (const { x: px, y: py } of neighbours) {
      if (px === x && py === y) {
          return true;
      }
  }
  return false;
}

// Вызов функции для генерации карты
