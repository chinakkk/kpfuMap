const canvas=document.getElementById("canvasMap")
const ctx=canvas.getContext("2d")


const backgroundMap=new Image();
backgroundMap.src="background/dark.png"//1873  x  617


var numWay=0;//номер который вводит пользователь в строку
var space=32;//пробел
var z=90;
var leftArrow=37;
var upArrow=38;
var rightArrow=39;
var downArrow=40;
var i=73;
var j=74;
var k=75;
var l=76;
var downStep=221
var upStep=219
var p=80

var wayColor='#99b0f6'


var text={
  x:0,
  y:0,
};

var pi=Math.PI

var wayFirst={
  x:935,
  y:580,
};
var way={
  x:wayFirst.x,
  y:wayFirst.y,
};

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
  ctx.drawImage(backgroundMap,30,30,backgroundMap.width*0.95,backgroundMap.height*0.95)
}
//обнулить канвас 
function canvasClear(){
  canvas.width = canvas.width;
}
//шаблон для текста
function drawText(text,x,y,color="black"){
    ctx.fillStyle=color
    ctx.font="10px Arial";
    ctx.fillText(text,x,y);
}
//шаблон для линии
function drawLine(xOne,yOne,xTwo,yTwo,width=0.1,color=wayColor){
    ctx.lineWidth = width; 
    ctx.moveTo(xOne, yOne); 
    ctx.lineTo(xTwo, yTwo); 
    ctx.strokeStyle = color;
    ctx.stroke();
}
function drawCircle(x=way.x,y=way.y,radius=4,start=0,finish=pi*2,watch=true,color=wayColor){
  // ctx.lineWidth=width
  ctx.strokeStyle=color
  ctx.arc(x,y,radius,start,finish,watch)
}
function drawRect(x=way.x,y=way.y,sizeOne=10,sizeTwo=10,color=wayColor){
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
  drawRect(way.x-5 ,way.y-5,10,10,wayColor)//квадрат в начале линии
  let arrayWay=new Array()
  arrayWay=graph.findShortestPath('0', finalNum)
  for(var i=0;i<arrayWay.length;i++){
    if(arrayWay[i]==1)upWay(76)
    if(arrayWay[i]==2)rightWay(75)
    if(arrayWay[i]==3)rightWay(8)
    if(arrayWay[i]==4)rightWay(44)
    if(arrayWay[i]==5)rightWay(46)
    if(arrayWay[i]==6)rightWay(46)
    if(arrayWay[i]==7)rightWay(45)
    if(arrayWay[i]==8)rightWay(36)
    if(arrayWay[i]==9)rightWay(25)
    if(arrayWay[i]==10)rightWay(105)
    if(arrayWay[i]==11)rightWay(77)
    if(arrayWay[i]==12)rightWay(2)
    if(arrayWay[i]==13)rightWay(40)
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
    if(arrayWay[i]==130)downWay(10)
    if(arrayWay[i]==131)upWay(10)
    if(arrayWay[i]==132)downWay(10)
    if(arrayWay[i]==133)upWay(10)
    if(arrayWay[i]==134)downWay(10)
    if(arrayWay[i]==135)upWay(10)
    if(arrayWay[i]==136)downWay(10)
    if(arrayWay[i]==137)upWay(10)
    if(arrayWay[i]==138)downWay(10)
    if(arrayWay[i]==139){downWay(45)}
    if(arrayWay[i]==140){downWay(45)}
    if(arrayWay[i]==141){upWay(10)}
    //if(arrayWay[i]==142){}
    if(arrayWay[i]==143){upWay(10)}//1
    if(arrayWay[i]==144){upWay(10)}
    if(arrayWay[i]==145){upWay(10)}//2
    if(arrayWay[i]==146){downWay(45)}
    if(arrayWay[i]==147){downWay(10)}//1
    if(arrayWay[i]==148){downWay(10)}
    if(arrayWay[i]==149){downWay(10)}//2
    if(arrayWay[i]==150){downWay(10)}
    if(arrayWay[i]==151){downWay(10)}
    if(arrayWay[i]==152){downWay(10)}
    if(arrayWay[i]==153){upWay(20)}
    if(arrayWay[i]==154){}
    if(arrayWay[i]==155){}
    if(arrayWay[i]==156){}
    if(arrayWay[i]==157){}
    if(arrayWay[i]==158){}
    if(arrayWay[i]==159){}

    
  }
  drawRect(way.x-5 ,way.y-5,10,10,wayColor)//квадрат в конце линии
  way.x=wayFirst.x
  way.y=wayFirst.y
  ctx.stroke()
}

function restartMap(){
  canvasClear()
  drawMap()
  way.x=wayFirst.x
  way.y=wayFirst.y
  text.x=0
  text.y=0
  step=5

}

var step=5;

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
    restartMap()
  }
  if(event.keyCode==i){
    
    upWay(step)
    text.y+=step
    console.log("Y="+text.y)
    ctx.stroke()
  }
  if(event.keyCode==k){
    downWay(step)
    text.y-=step
    console.log("Y="+text.y)
    ctx.stroke()
  }
  if(event.keyCode==j){
    leftWay(step)
    text.x-=step
    console.log("X="+text.x)
    ctx.stroke()
  }
  if(event.keyCode==l){
    rightWay(step)
    text.x+=step
    console.log("X="+text.x)
    ctx.stroke()
  }
  if(event.keyCode==upStep){
    step--
    console.log("шаг "+step)
  }
  if(event.keyCode==downStep){
    step++
    console.log("шаг "+step)
  }
  if(event.keyCode==p){
    text.x=0
    text.y=0
    
    canvasClear()
    drawMap()
    drawCircle()
  }

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
graph.addVertex('16');
graph.addVertex('17');
graph.addVertex('18');
graph.addVertex('19');
graph.addVertex('20');
graph.addVertex('21');
graph.addVertex('22');
graph.addVertex('23');
graph.addVertex('24');

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
graph.addVertex('160');
graph.addVertex('161');
graph.addVertex('162');

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
graph.addEdge('15', '16');
graph.addEdge('16', '17');
graph.addEdge('17', '18');
graph.addEdge('18', '19');
graph.addEdge('19', '20');
graph.addEdge('20', '21');
graph.addEdge('21', '22');
graph.addEdge('22', '23');

//путь к аудиториям
graph.addEdge('3', '129');
graph.addEdge('2', '130');
graph.addEdge('4', '131');
graph.addEdge('4', '132');
graph.addEdge('5', '133');
graph.addEdge('5', '134');
graph.addEdge('6', '135');
graph.addEdge('6', '136');
graph.addEdge('7', '137');
graph.addEdge('7', '138');
graph.addEdge('8', '139');
graph.addEdge('8', '140');
graph.addEdge('9', '141');
graph.addEdge('8', '146');
graph.addEdge('10', '143');
graph.addEdge('10', '144');
graph.addEdge('10', '145');
graph.addEdge('10', '147');
graph.addEdge('10', '148');
graph.addEdge('10', '149');
graph.addEdge('11', '153');
graph.addEdge('12', '150');
graph.addEdge('13', '151');
graph.addEdge('13', '152');
graph.addEdge('14', '154');
graph.addEdge('15', '155');
graph.addEdge('16', '156');
graph.addEdge('17', '157');
graph.addEdge('18', '158');
graph.addEdge('19', '159');
graph.addEdge('20', '160');
graph.addEdge('21', '161');
graph.addEdge('22', '162');


// document.addEventListener("DOMContentLoaded", function(){
// })

backgroundMap.onload=drawMap







































































