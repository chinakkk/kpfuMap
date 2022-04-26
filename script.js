var invis=document.getElementsByClassName('invis')


var space=32;
var numWay




document.addEventListener("keydown",keyPressFun)
function keyPressFun(event){

    if (event.keyCode==space) {
        numWay=Number(document.getElementById('inputWay').value)
        if(numWay!=0&&numWay<invis.length+1)
            editColor(numWay)
        document.getElementById('inputWay').value=''
    }

}
function editColor(numWay){
    invis[numWay-1].style.opacity=1
    
}
function giveNumWay(){
    numWay = Number(document.getElementById('inputWay').value)
    return numWay
}































