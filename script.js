var way=document.getElementsByClassName('way')


var space=32;
var numWay




document.addEventListener("keydown",keyPressFun)
function keyPressFun(event){

    if (event.keyCode==space) {
        // way1.style.background="black"
        numWay=Number(document.getElementById('inputWay').value)
        if(numWay!=0&&numWay<way.length+1)
            editColor(numWay)
        document.getElementById('inputWay').value=''
    }

}
function editColor(numWay){
    way[numWay-1].style.background="black"
    
}
function giveNumWay(){
    numWay = Number(document.getElementById('inputWay').value)
    return numWay
}































