import {Player} from './player.js' //Подключаем класс игрока
import { Enemy } from './enemy.js';//Подключаем класс врага
// Создание двухмерного массива карты
export const mapWidth = 40;
export const mapHeight = 24;
export const map = new Array(mapHeight).fill(null).map(() => new Array(mapWidth).fill("wall"));

// Генерация случайных прямоугольных комнат
function generateRooms(minSize, maxSize, minCount, maxCount) {
  const roomCount = getRandomNumber(minCount, maxCount);

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
  }
}

function generateCorridors(minCount, maxCount) {
  const corridorCount = getRandomNumber(minCount, maxCount);
  for (let i = 0; i < corridorCount; i++) {
    const isVertical = Math.random() < 0.5;
    const maxEndCoord = isVertical ? mapHeight - 1 : mapWidth - 1;
    const corridorLength = getRandomNumber(1, maxEndCoord);

    let startX, startY, endX, endY;

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

    map[startY][startX] = "floor";
    map[endY][endX] = "floor";

    const directionX = endX > startX ? 1 : -1;
    const directionY = endY > startY ? 1 : -1;

    for (let x = startX; x !== endX; x += directionX) {
      map[startY][x] = "floor";
    }

    for (let y = startY; y !== endY; y += directionY) {
      map[y][endX] = "floor";
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
          console.log(map[y][x])
      }while(map[y][x]!="floor");
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

function handleKeyPress(event) {
  const keyPressed = event.code;

  switch (keyPressed) {
    case "KeyW":
      player.move("up",map);
      renderMap();
      break;
    case "KeyS":
      player.move("down",map);
      renderMap();
      break;
    case "KeyA":
      player.move("left",map);
      renderMap();
      break;
    case "KeyD":
      player.move("right",map);
      renderMap();
      break;
    case "Space":
      player.attackNearbyEnemies();
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
  player = generatePlayer();

  renderMap();
}
function renderMap(){
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
    }
  }
}
let player;
document.addEventListener("keydown", handleKeyPress); //Привязываем обработчик событий к клавише
// Вызов функции для генерации карты
generateMap();
