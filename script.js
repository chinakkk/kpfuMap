const canvas=document.getElementById("canvasMap")
const ctx=canvas.getContext("2d")


const backgroundMap=new Image();
// backgroundMap.src="/jpegForm.jpg"
backgroundMap.src="map.gif"

var numWay=0;//номер который вводит пользователь в строку
var space=32;//пробел
var z=90;
var pi=Math.PI

var way={
  x:920,
  y:580,
};
//489

class Graph {
    constructor() {
      this.vertices = {}; // список смежности графа
    }
    
    addVertex(value) {
      if (!this.vertices[value]) {
        this.vertices[value] = [];
      }
    }
    
    addEdge(vertex1, vertex2) {
      if (!(vertex1 in this.vertices) || !(vertex2 in this.vertices)) {
        throw new Error('В графе нет таких вершин');
      }
  
      if (!this.vertices[vertex1].includes(vertex2)) {
        this.vertices[vertex1].push(vertex2);
      }
      if (!this.vertices[vertex2].includes(vertex1)) {
        this.vertices[vertex2].push(vertex1);
      }
    }


    // 


    dfs(startVertex, callback) {
        let list = this.vertices; // список смежности
        let stack = [startVertex]; // стек вершин для перебора
        let visited = { [startVertex]: 1 }; // посещенные вершины
        
        function handleVertex(vertex) {
          // вызываем коллбэк для посещенной вершины
          callback(vertex);
          
          // получаем список смежных вершин
          let reversedNeighboursList = [...list[vertex]].reverse();
         
          reversedNeighboursList.forEach(neighbour => {
            if (!visited[neighbour]) {
              // отмечаем вершину как посещенную
              visited[neighbour] = 1;
              // добавляем в стек
              stack.push(neighbour);
            }
          });
        }
        
        // перебираем вершины из стека, пока он не опустеет
        while(stack.length) {
          let activeVertex = stack.pop();
          handleVertex(activeVertex);
        }
        
        // проверка на изолированные фрагменты
        stack = Object.keys(this.vertices);
    
        while(stack.length) {
          let activeVertex = stack.pop();
          if (!visited[activeVertex]) {
            visited[activeVertex] = 1;
            handleVertex(activeVertex);
          }
        }
      }

    //   

    bfs(startVertex, callback) {
        let list = this.vertices; // список смежности
        let queue = [startVertex]; // очередь вершин для перебора
        let visited = { [startVertex]: 1 }; // посещенные вершины
        
        function handleVertex(vertex) {
          // вызываем коллбэк для посещенной вершины
          callback(vertex);
          
          // получаем список смежных вершин
          let neighboursList = list[vertex];
          
          neighboursList.forEach(neighbour => {
            if (!visited[neighbour]) {
              visited[neighbour] = 1;
              queue.push(neighbour);
            }
          });
        }
            
        // перебираем вершины из очереди, пока она не опустеет
        while(queue.length) {
          let activeVertex = queue.shift();
          handleVertex(activeVertex);
        }
        
        queue = Object.keys(this.vertices);
    
        // Повторяем цикл для незатронутых вершин
        while(queue.length) {
          let activeVertex = queue.shift();
          if (!visited[activeVertex]) {
            visited[activeVertex] = 1;
            handleVertex(activeVertex);
            }
        }
    }

    //   

    bfs2(startVertex) {
        let list = this.vertices; 
        let queue = [startVertex];
        let visited = { [startVertex]: 1 }; 
        
        // кратчайшее расстояние от стартовой вершины
        let distance = { [startVertex]: 0 }; 
        // предыдущая вершина в цепочке
        let previous = { [startVertex]: null };
    
        function handleVertex(vertex) {
          let neighboursList = list[vertex];
    
          neighboursList.forEach(neighbour => {
            if (!visited[neighbour]) {
              visited[neighbour] = 1;
              queue.push(neighbour);
              // сохраняем предыдущую вершину
              previous[neighbour] = vertex;
              // сохраняем расстояние 
              distance[neighbour] = distance[vertex] + 1;
            }
          });
        }
    
        // перебираем вершины из очереди, пока она не опустеет
        while(queue.length) {
          let activeVertex = queue.shift();
          handleVertex(activeVertex);
        }
        
        return { distance, previous }
    }

    //   


    findShortestPath(startVertex, finishVertex) {
        let result = this.bfs2(startVertex);
    
        if (!(finishVertex in result.previous)) 
            throw new Error(`Нет пути из вершины ${startVertex} в вершину ${finishVertex}`);
            
        let path = [];
        
        let currentVertex = finishVertex;
        
        while(currentVertex !== startVertex) {
          path.unshift(currentVertex);
          currentVertex = result.previous[currentVertex];
        }
        
        path.unshift(startVertex);
        
        return path;
    }

    //   


}


//прорисовка заднего фона
function drawBackground(sizeOne=canvas.height,sizeTwo=canvas.width){
    ctx.fillStyle="rgb(192, 248, 229)";
    ctx.fillRect(0,0,sizeOne,sizeTwo);
}
function drawMap(){
  ctx.drawImage(backgroundMap,0,0,backgroundMap.width*0.95,backgroundMap.height*0.95)
}
//обнулить канвас 
function canvasClear(){
  canvas.width = canvas.width;
}
//шаблон для текста
function drawText(text,x,y,color="black"){
    ctx.fillStyle=color
    ctx.font="20px Arial";
    ctx.fillText(text,x,y);
}
//шаблон для линии
function drawLine(xOne,yOne,xTwo,yTwo,width=0.1,color='rgb(121, 234, 196)'){
    ctx.lineWidth = width; 
    ctx.moveTo(xOne, yOne); 
    ctx.lineTo(xTwo, yTwo); 
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawCircle(x=way.x,y=way.y,radius=4,start=0,finish=pi*2,watch=true,color='rgb(121, 234, 196)'){
  // ctx.lineWidth=width
  ctx.strokeStyle=color
  ctx.arc(x,y,radius,start,finish,watch)
  ctx.stroke()
}
function drawRect(x=way.x,y=way.y,sizeOne=10,sizeTwo=10,color='rgb(121, 234, 196)'){
  ctx.fillStyle=color
  ctx.fillRect(x ,y,sizeOne,sizeTwo)
}
function drawSetka(){
  for(var i=0;i<canvas.width;i+=10)
  {
    var yMin=0
    var yMax=canvas.height
    drawLine(i,yMin,i,yMax,0.1,'rgb(151, 151, 151)')

    ctx.lineWidth = 1; 
    ctx.moveTo(i, yMin); 
    ctx.lineTo(i, yMax); 
    ctx.strokeStyle = 'rgb(151, 151, 151)';
    ctx.stroke();
  }
  for(var i=0;i<canvas.height;i+=10)
  {
    
    var yMin=0
    var yMax=canvas.width
    drawLine(yMin,i,yMax,i,0.1,'rgb(151, 151, 151)')


    ctx.lineWidth = 1; 
    ctx.moveTo(yMin, i); 
    ctx.lineTo(yMax, i); 
    ctx.strokeStyle = 'rgb(151, 151, 151)';
    ctx.stroke();
  }
}
function upWay(sizePx=0){
  for(var i=way.y-sizePx;i<way.y;way.y--){
    // drawRect()
    drawCircle()
  }
}
function downWay(sizePx=0){
  for(var i=way.y+sizePx;i>way.y;way.y++){
    // drawRect()
    drawCircle()
  }
}
function rightWay(sizePx=0){
  for(var i=way.x+sizePx;i>way.x;way.x++){
    // drawRect()
    drawCircle()
  }
}
function leftWay(sizePx=0){
  for(var i=way.x-sizePx;i<way.x;way.x--){
    // drawRect()
    drawCircle()
  }
}

function searchRoom(finalNum){

  canvasClear()
  drawMap()
  
  let arrayWay=new Array()
  arrayWay=graph.findShortestPath('0', finalNum)
  console.log(arrayWay)
  for(var i=0;i<arrayWay.length;i++){
    if(arrayWay[i]==1)upWay(86)
    if(arrayWay[i]==2)rightWay(83)
    if(arrayWay[i]==3)rightWay(45)
    if(arrayWay[i]==4)rightWay(45)
    if(arrayWay[i]==5)drawLine()
    if(arrayWay[i]==6)drawLine()
    if(arrayWay[i]==7)drawLine()
    if(arrayWay[i]==8)drawLine()
    if(arrayWay[i]==9)drawLine()
    if(arrayWay[i]==10)drawLine()
    if(arrayWay[i]==11)drawLine()
    if(arrayWay[i]==12)drawLine()
    if(arrayWay[i]==14)drawLine()
    if(arrayWay[i]==14)drawLine()
    if(arrayWay[i]==15)drawLine()
    if(arrayWay[i]==16)drawLine()
    if(arrayWay[i]==17)drawLine()
    if(arrayWay[i]==18)drawLine()
    if(arrayWay[i]==19)drawLine()
    if(arrayWay[i]==20)drawLine()
    if(arrayWay[i]==21)drawLine()
    if(arrayWay[i]==22)drawLine()
    if(arrayWay[i]==23)drawLine()
    if(arrayWay[i]==24)drawLine()

    if(arrayWay[i]==129)upWay(10)
    if(arrayWay[i]==130)upWay(10)
    if(arrayWay[i]==131)upWay(10)
    if(arrayWay[i]==132)upWay(10)
    if(arrayWay[i]==133)upWay(10)
    if(arrayWay[i]==134)upWay(10)
    if(arrayWay[i]==135)upWay(10)
    if(arrayWay[i]==136)upWay(10)
    if(arrayWay[i]==137)upWay(10)
    if(arrayWay[i]==138)drawLine();
    if(arrayWay[i]==139)drawLine();
    if(arrayWay[i]==140)drawLine();
    if(arrayWay[i]==141)drawLine();
    if(arrayWay[i]==142)drawLine();
    if(arrayWay[i]==143)drawLine();
    if(arrayWay[i]==144)drawLine();
    if(arrayWay[i]==145)drawLine();
    if(arrayWay[i]==146)drawLine();
    if(arrayWay[i]==147)drawLine();
    if(arrayWay[i]==148)drawLine();
    if(arrayWay[i]==149)drawLine();
    if(arrayWay[i]==150)drawLine();
    if(arrayWay[i]==151)drawLine();
    if(arrayWay[i]==152)drawLine();
    if(arrayWay[i]==153)drawLine();
    if(arrayWay[i]==154)drawLine();
    if(arrayWay[i]==155)drawLine();
    if(arrayWay[i]==156)drawLine();
    if(arrayWay[i]==157)drawLine();
    if(arrayWay[i]==158)drawLine();
    if(arrayWay[i]==159)drawLine();

    
  }
}


//нажатие
document.addEventListener("keydown",pressKey)
function pressKey(event){
  if(event.keyCode==space){
    numWay=Number(document.getElementById('inputWay').value)
    document.getElementById('inputWay').value=''
    if(numWay>0){
      searchRoom(numWay)
    }
  }
  if(event.keyCode==z){
    drawSetka()
  }
  searchRoom(135)
} 



let graph = new Graph();
graph.addVertex('0');
graph.addVertex('1');
graph.addVertex('2');
graph.addVertex('3');
graph.addVertex('4');
graph.addVertex('5');
graph.addVertex('6');
graph.addVertex('7');
graph.addVertex('8');
graph.addVertex('9');
graph.addVertex('10');
graph.addVertex('11');
graph.addVertex('12');
graph.addVertex('13');
graph.addVertex('14');
graph.addVertex('15');

//аудитории
graph.addVertex('129');
graph.addVertex('130');
graph.addVertex('131');
graph.addVertex('132');
graph.addVertex('133');
graph.addVertex('134');
graph.addVertex('135');
graph.addVertex('136');
graph.addVertex('137');
graph.addVertex('138');
graph.addVertex('139');
graph.addVertex('140');
graph.addVertex('141');
graph.addVertex('142');
graph.addVertex('143');
graph.addVertex('144');
graph.addVertex('145');
graph.addVertex('146');
graph.addVertex('147');
graph.addVertex('148');
graph.addVertex('149');
graph.addVertex('150');
graph.addVertex('151');
graph.addVertex('152');
graph.addVertex('153');
graph.addVertex('154');
graph.addVertex('155');
graph.addVertex('156');
graph.addVertex('157');
graph.addVertex('158');
graph.addVertex('159');

//путь
graph.addEdge('0', '1');
graph.addEdge('1', '2');
graph.addEdge('2', '3');
graph.addEdge('3', '4');
graph.addEdge('4', '5');
graph.addEdge('5', '6');
graph.addEdge('6', '7');
graph.addEdge('7', '8');
graph.addEdge('8', '9');
graph.addEdge('9', '10');
graph.addEdge('10', '11');
graph.addEdge('11', '12');
graph.addEdge('12', '13');
graph.addEdge('13', '14');
graph.addEdge('14', '15');

//путь к аудиториям
graph.addEdge('2', '129');
graph.addEdge('2', '130');
graph.addEdge('3', '131');
graph.addEdge('3', '132');
graph.addEdge('4', '133');
graph.addEdge('4', '134');
graph.addEdge('5', '135');
graph.addEdge('5', '136');
graph.addEdge('6', '137');
graph.addEdge('6', '138');
graph.addEdge('7', '139');
graph.addEdge('8', '140');
graph.addEdge('8', '141');
graph.addEdge('8', '146');
graph.addEdge('9', '143');
graph.addEdge('9', '144');
graph.addEdge('9', '145');
graph.addEdge('9', '147');
graph.addEdge('9', '148');
graph.addEdge('9', '149');
graph.addEdge('10', '153');
graph.addEdge('10', '150');
graph.addEdge('11', '151');
graph.addEdge('11', '152');
graph.addEdge('12', '154');
graph.addEdge('13', '155');
graph.addEdge('14', '157');
graph.addEdge('15', '158');


// document.addEventListener("DOMContentLoaded", function(){
// })

backgroundMap.onload=drawMap








































































