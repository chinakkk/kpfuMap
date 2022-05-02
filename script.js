const canvas=document.getElementById("canvasMap")
const ctx=canvas.getContext("2d")


var numWay;//номер который вводит пользователь в строку
var space=32;//пробел

var way=new Array()
var way=[true,true,true,true,true,true,true]//тестовый массив для отключения прорисовки красных линий

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
//красные линии
function drawRedLines(numWay){

    ctx.fillStyle="rgb(192, 248, 229)";
    ctx.fillRect(0,0,2000,2000);

    way[numWay]=false

    ctx.fillStyle="red";
    if(way[0])ctx.fillRect(100,0,10,500);
    if(way[1])ctx.fillRect(150,0,10,500);
    if(way[2])ctx.fillRect(200,0,10,500);
    if(way[3])ctx.fillRect(250,0,10,500);
    if(way[4])ctx.fillRect(300,0,10,500);
    if(way[5])ctx.fillRect(350,0,10,500);
    if(way[6])ctx.fillRect(400,0,10,500);

    drawText("1",80,20)
    drawText("2",130,20)
    drawText("3",180,20)
    drawText("4",230,20)
    drawText("5",280,20)
    drawText("6",330,20)
    drawText("7",380,20)

}
//стереть красные линии
function drawRedLineRestart(){
  for(let i=0;i<way.length;i++)
  {
      way[i]=true
  }
}



//прорисовка определенной верви
function drawWayTree(finalNum){

  let arrayWay=new Array()
  arrayWay=graph.findShortestPath('1', finalNum)
  canvasClear()
  for(var i=0;i<arrayWay.length;i++){
    if(arrayWay[i]==1){
      drawLine(10, 250,100, 250);//1
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==2){
      drawLine(100, 250,100, 150);//2
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==3){
      drawLine(100, 150,200, 150);//3
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==4){
      drawLine(200, 150,200, 100);//4
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==5){
      drawLine(200, 100,250, 100);//5
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==6){
      drawLine(200, 150,200, 200);//6
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==7){
      drawLine(200, 200,250, 200);//7
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==8){
      drawLine(100, 250,100, 350);//8
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==9){
      drawLine(100, 350,200, 350);//9
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==10){
      drawLine(200, 350,200, 400);//10
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==11){
      drawLine(200, 400,250, 400);//11
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==12){
      drawLine(200, 350,200, 300);//12
      // console.log(arrayWay[i])
    }
    if(arrayWay[i]==13){
      drawLine(200, 300,250, 300);//13
      // console.log(arrayWay[i])
    }
  }
  drawNumber()
  
}
//прорисовка всего терева
function drawWayPic(){
  drawLine(10, 250,100, 250);
  drawLine(100, 250,100, 150)
  drawLine(100, 150,200, 150)
  drawLine(200, 150,200, 100)
  drawLine(200, 100,250, 100)
  drawLine(200, 150,200, 200)
  drawLine(200, 200,250, 200)
  drawLine(100, 250,100, 350)
  drawLine(100, 350,200, 350)
  drawLine(200, 350,200, 400)
  drawLine(200, 400,250, 400)
  drawLine(200, 350,200, 300)
  drawLine(200, 300,250, 300)
}
//прорисовка цифр на дереве
function drawNumber(){

  drawText("1",80,240)
  drawText("2",80,140)
  drawText("3",180,140)
  drawText("4",190,90)
  drawText("5",240,90)
  drawText("6",190,220)
  drawText("7",240,220)
  drawText("8",80,380)
  drawText("9",180,380)
  drawText("10",180,430)
  drawText("11",230,430)
  drawText("12",180,290)
  drawText("13",230,290)
}


//прорисовка заднего фона
function drawBackground(sizeOne=2000,sizeTwo=2000){
    ctx.fillStyle="rgb(192, 248, 229)";
    ctx.fillRect(0,0,sizeOne,sizeTwo);
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
function drawLine(xOne,yOne,xTwo,yTwo,width=2,color='black'){
    ctx.lineWidth = width; 
    ctx.moveTo(xOne, yOne); 
    ctx.lineTo(xTwo, yTwo); 
    ctx.strokeStyle = color;
    ctx.stroke();
}
//////////////////нажатие
document.addEventListener("keydown",pressKey)
function pressKey(event){
  if(event.keyCode==space){
    numWay=Number(document.getElementById('inputWay').value)
    document.getElementById('inputWay').value=''
    if(numWay!=1)drawWayTree(numWay)
    else if(numWay==1){
      canvasClear()
      drawLine(10, 250,100, 250);
      drawNumber()
    }
  }
} 

let graph = new Graph();
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

graph.addEdge('1', '2');
graph.addEdge('2', '3');
graph.addEdge('3', '4');
graph.addEdge('3', '6');
graph.addEdge('4', '5');
graph.addEdge('6', '7');
graph.addEdge('1', '8');
graph.addEdge('8', '9');
graph.addEdge('9', '12');
graph.addEdge('9', '10');
graph.addEdge('12', '13');
graph.addEdge('10', '11');

drawWayPic()
drawNumber()














































































