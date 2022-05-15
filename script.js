const canvas=document.getElementById("canvasMap")
const ctx=canvas.getContext("2d")


const backgroundMap=new Image();
backgroundMap.src="background/dark.png"
backgroundMap.src="background/blue.png"

// backgroundMap.src="/background/orange.png"


var numWay=0;//номер который вводит пользователь в строку
var space=32;//пробел
var zKey=90;
// var leftArrow=37;
// var upArrow=38;
// var rightArrow=39;
var downArrowKey=40;
var iKey=73;
var jKey=74;
var kKey=75;
var lKey=76;
var downStep=221
var upStep=219
var pKey=80
var rightArrowKey=39
var enterKey=13

var toggleWayLine= true

var wayColor='#6C87D9'



var text={
  x:0,
  y:0,
};

var pi=Math.PI

var wayFirst={
  x:935,
  y:597,
};
var way={
  x:wayFirst.x,
  y:wayFirst.y,
};
var coordinate=[];
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
  if(!toggleWayLine){
    canvasClear()
    drawMap()
  }
  ctx.strokeStyle=color
  ctx.arc(x,y,radius,start,finish,watch)
}
function drawRect(x=way.x,y=way.y,sizeOne=10,sizeTwo=10,color=wayColor){
  ctx.fillStyle=color
  ctx.fillRect(x ,y,sizeOne,sizeTwo)
}

function upWay(sizePx=0){
  for(var i=0;i<sizePx;i++){
    way.y--

    // drawCircle()
    coordinate.push([way.x,way.y])
    
  }
}
function downWay(sizePx=0){
  for(var i=0;i<sizePx;i++){
    way.y++
    // drawCircle()
    coordinate.push([way.x,way.y])
  }
}
function rightWay(sizePx=0){
  for(var i=0;i<sizePx;i++){
    way.x++
    // drawCircle()
    coordinate.push([way.x,way.y])
  }
}
function leftWay(sizePx=0){
  for(var i=0;i<sizePx;i++){
    way.x--
    // drawCircle()
    coordinate.push([way.x,way.y])
  }
}

function addEdgeGraph(start,finish){
  for(var i=start;i<finish;i++)
    graph.addEdge(i,i+1)
}
function wayPlay(){

  
  var i=0
  var timer=setInterval(function(){
    if(!coordinate.length){
      clearInterval(timer)
      return;
    }
    if(i==coordinate.length)
    {
      drawRect(coordinate[coordinate.length-1][0]-5,coordinate[coordinate.length-1][1]-5,10,10,wayColor)
      clearInterval(timer)
      console.log('f')
      
      return;
      
    }

    for(var j=0;j<20;j++){
      if(i!=coordinate.length){
        drawCircle(coordinate[i][0],coordinate[i][1])
        i++
      }
      else break
    }
   
    

    ctx.stroke()   
    
    
  },10)
  
  
  
}
function searchRoom(finalNum){
  
  if(finalNum>=101|| typeof finalNum === 'string' || finalNum instanceof String ){
    coordinate.length=0
    canvasClear()
    drawMap()
    drawRect(way.x-5 ,way.y-5,10,10,wayColor)//квадрат в начале линии
    let arrayWay=new Array()
    arrayWay=graph.findShortestPath(0, finalNum)
    for(var i=0;i<arrayWay.length;i++){
      if(arrayWay[i]==1){
        upWay(93)
      }
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
      if(arrayWay[i]==14){rightWay(2);upWay(39)}
      if(arrayWay[i]==15)upWay(37)
      if(arrayWay[i]==16)upWay(16)
      if(arrayWay[i]==17){leftWay(7);upWay(72)}
      if(arrayWay[i]==18)upWay(33)
      if(arrayWay[i]==19)upWay(34)

      if(arrayWay[i]==20)upWay(34)
      if(arrayWay[i]==21)upWay(35)
      if(arrayWay[i]==22)upWay(34)
      if(arrayWay[i]==23)upWay(40)
      if(arrayWay[i]==24)rightWay(62)
      if(arrayWay[i]==25)rightWay(60)
      if(arrayWay[i]==26)rightWay(42)
      if(arrayWay[i]==27)rightWay(45)
      if(arrayWay[i]==28)rightWay(44)
      if(arrayWay[i]==29)rightWay(45)

      if(arrayWay[i]==30){leftWay(102);upWay(34)}
      if(arrayWay[i]==31)leftWay(33)
      if(arrayWay[i]==32)upWay(180)
      if(arrayWay[i]==33)rightWay(46)
      if(arrayWay[i]==34)rightWay(5)
      if(arrayWay[i]==35)rightWay(32)
      if(arrayWay[i]==36)leftWay(39)
      if(arrayWay[i]==37)leftWay(9)
      if(arrayWay[i]==38)leftWay(26)
      if(arrayWay[i]==39){upWay(2);leftWay(75)}

      if(arrayWay[i]==40)leftWay(9)
      if(arrayWay[i]==41)leftWay(47)
      if(arrayWay[i]==42)leftWay(1)
      if(arrayWay[i]==43)leftWay(44)
      if(arrayWay[i]==44)leftWay(1)
      if(arrayWay[i]==45)leftWay(44)
      if(arrayWay[i]==46)leftWay(47)
      if(arrayWay[i]==47)leftWay(11)
      if(arrayWay[i]==48)leftWay(49)
      if(arrayWay[i]==49)leftWay(39)

      if(arrayWay[i]==50)leftWay(8)
      if(arrayWay[i]==51)leftWay(33)
      if(arrayWay[i]==52)leftWay(17)
      if(arrayWay[i]==53)leftWay(20)
      if(arrayWay[i]==54)leftWay(39)
      if(arrayWay[i]==55)leftWay(19)
      if(arrayWay[i]==56)leftWay(36)
      if(arrayWay[i]==57)leftWay(18)
      if(arrayWay[i]==58)leftWay(30)
      if(arrayWay[i]==59)downWay(36)

      if(arrayWay[i]==60){leftWay();upWay(45)}
      if(arrayWay[i]==61)upWay(48)
      if(arrayWay[i]==62)upWay(76)
      if(arrayWay[i]==63)upWay(45)
      if(arrayWay[i]==64)upWay(30)
      if(arrayWay[i]==65)upWay(11)
      if(arrayWay[i]==66)upWay(16)
      if(arrayWay[i]==67)upWay(102)
      if(arrayWay[i]==68){upWay(24);rightWay(40)}
      if(arrayWay[i]==69)rightWay(6)

      if(arrayWay[i]==70)rightWay(40)
      if(arrayWay[i]==71)rightWay(37)
      if(arrayWay[i]==72)rightWay(16)
      if(arrayWay[i]==73)leftWay(28)
      if(arrayWay[i]==74){leftWay(12);downWay(7);leftWay(22)}
      if(arrayWay[i]==75){leftWay(48)}
      

  //аудитории

      if(arrayWay[i]=='101а')downWay(8)
      if(arrayWay[i]=='102а')downWay(8)
      if(arrayWay[i]=='103а')downWay(8)
      if(arrayWay[i]=='104а')leftWay(8)
      if(arrayWay[i]=='105а')leftWay(8)
      if(arrayWay[i]=='106а')upWay(8)
      if(arrayWay[i]=='107а')upWay(8)
      if(arrayWay[i]=='108а')upWay(8)
      if(arrayWay[i]=='109а')upWay(8)
      if(arrayWay[i]=='110а')upWay(8)
      if(arrayWay[i]=='111а')rightWay(7)
      if(arrayWay[i]=='112а')downWay(8)
      if(arrayWay[i]=='113а')downWay(8)

      if(arrayWay[i]=='101в')upWay(8)
      if(arrayWay[i]=='102в')downWay(8)
      if(arrayWay[i]=='103в')upWay(8)
      if(arrayWay[i]=='104в')downWay(8)
      if(arrayWay[i]=='105в')upWay(8)
      if(arrayWay[i]=='106в')downWay(8)
      if(arrayWay[i]=='107в')upWay(32)
      if(arrayWay[i]=='108в'){leftWay(3);upWay(9)}
      if(arrayWay[i]=='109в')upWay(9)
      if(arrayWay[i]=='110в')leftWay(16)
      if(arrayWay[i]=='111в')downWay(35)
      if(arrayWay[i]=='112в')leftWay(16)
      if(arrayWay[i]=='113в')rightWay(13)
      if(arrayWay[i]=='114в')leftWay(16)
      if(arrayWay[i]=='115в')rightWay(13)
      if(arrayWay[i]=='116в')leftWay(16)
      if(arrayWay[i]=='117в')rightWay(13)
      if(arrayWay[i]=='118в')leftWay(16)
      if(arrayWay[i]=='119в')downWay(8)

      if(arrayWay[i]==102)leftWay(17)
      if(arrayWay[i]==103)downWay(10)
      if(arrayWay[i]==104)downWay(10)
      if(arrayWay[i]==105)downWay(10)
      if(arrayWay[i]==106)downWay(10)
      if(arrayWay[i]==107)leftWay(12)
      if(arrayWay[i]==108)upWay(10)
      if(arrayWay[i]==109)upWay(10)

      if(arrayWay[i]==110)downWay(10)
      if(arrayWay[i]==111)upWay(10)
      if(arrayWay[i]==112)upWay(10)
      if(arrayWay[i]==113)downWay(35)
      if(arrayWay[i]==114)downWay(35)
      if(arrayWay[i]==115)upWay(10)
      if(arrayWay[i]==116)downWay(55)
      if(arrayWay[i]==117)downWay(55)
      if(arrayWay[i]==118)downWay(10)
      if(arrayWay[i]==119)upWay(10)

      if(arrayWay[i]==120)downWay(10)
      if(arrayWay[i]==121)upWay(10)
      if(arrayWay[i]==122)downWay(10)
      if(arrayWay[i]==123)upWay(10)
      if(arrayWay[i]==124)upWay(17)
      if(arrayWay[i]==125)upWay(10)
      if(arrayWay[i]==126)downWay(10)
      if(arrayWay[i]==127)upWay(10)
      if(arrayWay[i]==128)downWay(10)

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
      if(arrayWay[i]==154){rightWay(14)}
      if(arrayWay[i]==155){rightWay(14)}
      if(arrayWay[i]==156){leftWay(14)}
      if(arrayWay[i]==157){leftWay(31)}
      if(arrayWay[i]==158){leftWay(31)}
      if(arrayWay[i]==159){leftWay(31)}
      if(arrayWay[i]==160){leftWay(31)}
      if(arrayWay[i]==161){leftWay(31)}
      if(arrayWay[i]==162){leftWay(31)}
      if(arrayWay[i]==163){upWay(6)}
      if(arrayWay[i]==164){upWay(6)}
      if(arrayWay[i]==165){leftWay(10)}
      if(arrayWay[i]==166)upWay(13)
      if(arrayWay[i]==167)upWay(13)
      if(arrayWay[i]==168)upWay(13)
      if(arrayWay[i]==169)upWay(13)
      if(arrayWay[i]==170)upWay(13)
      if(arrayWay[i]==171)upWay(13)
      if(arrayWay[i]==172)upWay(13)


    }
    wayPlay()
    way.x=wayFirst.x
    way.y=wayFirst.y
    ctx.stroke()
  }
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

//нажатие на кнопку

document.querySelector('.inputNumButton').onclick=function(){
  numWay=document.getElementById('inputWay').value
  document.getElementById('inputWay').value=''
  searchRoom(numWay)
}

//нажатие
document.addEventListener("keydown",pressKey)
function pressKey(event){
  if(event.keyCode==enterKey){
    numWay=document.getElementById('inputWay').value
    document.getElementById('inputWay').value=''
    searchRoom(numWay)
  }
  if(event.keyCode==downArrowKey){
    // searchRoom(30)
  }
  if(event.keyCode==zKey){
    restartMap()
  }
  if(event.keyCode==iKey){
    upWay(step)
    text.y+=step
    console.log("Y="+text.y)
    ctx.stroke()
  }
  if(event.keyCode==kKey){
    downWay(step)
    text.y-=step
    console.log("Y="+text.y)
    ctx.stroke()
  }
  if(event.keyCode==jKey){
    leftWay(step)
    text.x-=step
    console.log("X="+text.x)
    ctx.stroke()
  }
  if(event.keyCode==lKey){
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
  if(event.keyCode==pKey){
    text.x=0
    text.y=0
    
    canvasClear()
    drawMap()
    drawCircle()
  }
  if(event.keyCode==rightArrowKey){
    if(toggleWayLine)toggleWayLine=false
    else toggleWayLine=true

  }
  
} 
let graph = new Graph();
//создание вершин с 0 до 75
for(var i=0;i<=75;i++){
  graph.addVertex(i)
}
//создание ребер пути
addEdgeGraph(0,29)
graph.addEdge(23,30)
addEdgeGraph(30,31)
graph.addEdge(1,32)
addEdgeGraph(32,35)
addEdgeGraph(36,38)
graph.addEdge(32,36)
graph.addEdge(1,39)
addEdgeGraph(39,59)
graph.addEdge(58,60)
addEdgeGraph(60,72)
graph.addEdge(67,73)
addEdgeGraph(73,75)

//вершины, аудитории с 102 до 171
for(var i=101;i<=172;i++){
  graph.addVertex(i)
}
for(var i=101;i<=113;i++){
  let numString=i.toString()+'а'
  graph.addVertex(numString)
}
for(var i=101;i<=119;i++){
  let numString=i.toString()+'в'
  graph.addVertex(numString)
}


//ребра, путь к аудиториям
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
graph.addEdge('20', '161');
graph.addEdge('21', '160');
graph.addEdge('22', '162');
graph.addEdge('24', '166');
graph.addEdge('25', '167');
graph.addEdge('26', '168');
graph.addEdge('27', '169');
graph.addEdge('28', '170');
graph.addEdge('29', '171');
graph.addEdge('29', '172');
graph.addEdge('30', '163');
graph.addEdge('31', '164');
graph.addEdge('31', '165');
graph.addEdge('33', '108а');
graph.addEdge('34', '113а');
graph.addEdge('35', '109а');
graph.addEdge('35', '110а');
graph.addEdge('35', '111а');
graph.addEdge('35', '112а');
graph.addEdge('36', '107а');
graph.addEdge('37', '101а');
graph.addEdge('38', '106а');
graph.addEdge('38', '105а');
graph.addEdge('38', '104а');
graph.addEdge('38', '102а');
graph.addEdge('38', '103а');
graph.addEdge('39', '128');
graph.addEdge('40', '127');
graph.addEdge('41', '126');
graph.addEdge('42', '125');
graph.addEdge('43', '122');
graph.addEdge('44', '124');
graph.addEdge('45', '120');
graph.addEdge('45', '123');
graph.addEdge('46', '118');
graph.addEdge('47', '121');
graph.addEdge('48', '119');
graph.addEdge('49', '115');

graph.addEdge('50', '116');
graph.addEdge('50', '117');
graph.addEdge('51', '111');
graph.addEdge('52', '113');
graph.addEdge('52', '114');
graph.addEdge('53', '112');
graph.addEdge('54', '110');
graph.addEdge('55', '108');
graph.addEdge('56', '106');
graph.addEdge('57', '109');
graph.addEdge('59', '102');
graph.addEdge('59', '103');
graph.addEdge('59', '104');
graph.addEdge('59', '105');

graph.addEdge('60', '107');
graph.addEdge('61', '119в');
graph.addEdge('62', '117в');
graph.addEdge('62', '118в');
graph.addEdge('63', '115в');
graph.addEdge('63', '116в');
graph.addEdge('64', '114в');
graph.addEdge('65', '113в');
graph.addEdge('66', '112в');
graph.addEdge('68', '106в');
graph.addEdge('69', '105в');

graph.addEdge('70', '103в');
graph.addEdge('70', '104в');
graph.addEdge('71', '102в');
graph.addEdge('72', '101в');
graph.addEdge('73', '107в');
graph.addEdge('74', '108в');
graph.addEdge('74', '111в');
graph.addEdge('75', '109в');
graph.addEdge('75', '110в');

// document.addEventListener("DOMContentLoaded", function(){
// })

backgroundMap.onload=drawMap





document.querySelector('#orangeCircle').onclick=function(){
  backgroundMap.src="background/orange.png"
  document.getElementById('orangeCircle').style.border="0.3vh solid rgb(255, 255, 255)"
  document.getElementById('blueCircle').style.border="0px solid rgb(255, 255, 255)"
  document.getElementById('darkCircle').style.border="0px solid rgb(255, 255, 255)"
  wayColor="#dd8e72"



}
document.querySelector('#blueCircle').onclick=function(){
  backgroundMap.src="background/blue.png"
  document.getElementById('blueCircle').style.border="0.3vh solid rgb(255, 255, 255)"
  document.getElementById('orangeCircle').style.border="0px solid rgb(255, 255, 255)"
  document.getElementById('darkCircle').style.border="0px solid rgb(255, 255, 255)"
  wayColor="#6C87D9"

}
document.querySelector('#darkCircle').onclick=function(){
  backgroundMap.src="background/dark.png"
  document.getElementById('darkCircle').style.border="0.3vh solid rgb(255, 255, 255)"
  document.getElementById('orangeCircle').style.border="0px solid rgb(255, 255, 255)"
  document.getElementById('blueCircle').style.border="0px solid rgb(255, 255, 255)"
  wayColor="#4F5E8C"

}
var position=0
window.addEventListener('scroll', function() {
  if(window.pageYOffset>75 && position==0){
    document.querySelector('.intro').classList.add('position_fixed_intro')
    document.querySelector('.map').classList.add('position_fixed_map')
    position=1
  }
  else if(window.pageYOffset<75&&position==1)
  {
    document.querySelector('.intro').classList.remove('position_fixed_intro')
    document.querySelector('.map').classList.remove('position_fixed_map')    
    position=0
  }


});































































