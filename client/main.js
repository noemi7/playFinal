
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

//import { Scores } from './scores.js';
import './main.html';

score = 0;







var pause;


var canvas ;
var ctx ;
var ballRadius;
var x;
var y;
var dx;
var dy ;
var paddleHeight;
var paddleWidth;
var paddleX ;
var rightPressed ;
var leftPressed ;


var ladriFilcount;
var ladriColumcount;
var ladriWidth ;
var ladriHeight ;
var ladriPadding ;
var ladriOffsetTop ;
var ladriOffsetLeft ;
var ps;

var lives ;

var ladris ;



Template.canvas.onRendered(function() {
  idcanvas = 0;
  canvas = document.getElementById('myCanvas');
 ctx = canvas.getContext('2d');
 ballRadius = 10;
 x = canvas.width/2;
 y = canvas.height-30;
 dx = 2;
 dy = -2;
 paddleHeight = 10;
 paddleWidth = 75;
 paddleX = (canvas.width-paddleWidth)/2;
 rightPressed = false;
 leftPressed = false;

 pause = 1;
 ladriFilcount= 5;
 ladriColumcount = 3;
 ladriWidth = 75;
 ladriHeight = 20;
 ladriPadding = 10;
 ladriOffsetTop = 30;
 ladriOffsetLeft = 30;
 score = 0;
 lives = 1;

 ladris = [];
for(c=0; c<ladriColumcount; c++) {
    ladris[c] = [];
    for(r=0; r<ladriFilcount; r++) {
        ladris[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function iniciar () {
    idcanvas = 0;
  canvas = document.getElementById('myCanvas');
 ctx = canvas.getContext('2d');
 ballRadius = 10;
 x = canvas.width/2;
 y = canvas.height-30;
 dx = 2;
 dy = -2;
 paddleHeight = 10;
 paddleWidth = 75;
 paddleX = (canvas.width-paddleWidth)/2;
 rightPressed = false;
 leftPressed = false;

 pause = 1;
 ladriFilcount= 5;
 ladriColumcount = 3;
 ladriWidth = 75;
 ladriHeight = 20;
 ladriPadding = 10;
 ladriOffsetTop = 30;
 ladriOffsetLeft = 30;
 score = 0;
 lives = 3;

 ladris = [];
for(c=0; c<ladriColumcount; c++) {
    ladris[c] = [];
    for(r=0; r<ladriFilcount; r++) {
        ladris[c][r] = { x: 0, y: 0, status: 1 };
    }
}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
    for(c=0; c<ladriColumcount; c++) {
        for(r=0; r<ladriFilcount; r++) {
            var b = ladris[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+ladriWidth && y > b.y && y < b.y+ladriHeight) {
                    dy = -dy;
                    b.status = 0;
                   // console.log(status);
                    score++;

                    //Ganamos
                    if(score == ladriFilcount*ladriColumcount && lives) {
                        date = new Date();

                        Scores.insert({id:Meteor.userId(),score:score,lives:lives,fecha: date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear(),res:"success"});
                        document.getElementById("panel").className = "panel panel-success";
                        document.getElementById('panel').style.display = 'inline';
                        papa = document.getElementById("idcv");
                        var oldcanv = document.getElementById('myCanvas');
                        papa.removeChild(oldcanv)

                        phead= document.getElementById("phead");
                        texto = "Ganaste";
                        phead.innerHTML = texto;

                        pbody= document.getElementById("pbody");
                        texto = "Score: "+score+"<br> Lives: "+lives;
                        pbody.innerHTML = texto;
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawladris() {
    for(c=0; c<ladriColumcount; c++) {
        for(r=0; r<ladriFilcount; r++) {
            if(ladris[c][r].status == 1) {
                var ladriX = (r*(ladriWidth+ladriPadding))+ladriOffsetLeft;
                var ladriY = (c*(ladriHeight+ladriPadding))+ladriOffsetTop;
                ladris[c][r].x = ladriX;
                ladris[c][r].y = ladriY;
                ctx.beginPath();
                ctx.rect(ladriX, ladriY, ladriWidth, ladriHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function clearlives () {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: 0", canvas.width-65, 20);
}

function draw() {

    
    pause=0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawladris();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                if (score<15) {
                    date = new Date();
                    fsave= date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDay()+"/"+date.getMonth()+"/"+date.getFullYear();
                    

                    Scores.insert({id:Meteor.userId(),score:score,lives:lives,fecha:fsave,res:"danger"});

                    document.getElementById("panel").className = "panel panel-danger";
                    document.getElementById('panel').style.display = 'inline';
                    papa = document.getElementById("idcv");
                    var oldcanv = document.getElementById('myCanvas');
                    papa.removeChild(oldcanv)

                    phead= document.getElementById("phead");
                    texto = "Perdiste";
                    phead.innerHTML = texto;

                    pbody= document.getElementById("pbody");
                    texto = "Score: "+score+"<br> Lives: "+lives;
                    pbody.innerHTML = texto;

                    return 0;
                    
                }
            }


            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
    idcanvas=requestAnimationFrame(draw);
}

draw();

var boton = document.getElementById('new');
boton.addEventListener("click", pausar, false);
function pausar () {
    document.getElementById('panel').style.display = 'none';
    papa = document.getElementById("idcv");  
    texto = '<canvas id = "myCanvas" width = "480" height = "320"> </canvas>';
    papa.innerHTML = texto;

    cancelAnimationFrame(idcanvas);
    iniciar();
    draw();
}

});
Template.score.helpers({
    'scores': function(){
        var currentUserId = Meteor.userId();
        return Scores.find({id: currentUserId},{sort: {fecha: -1},limit: 5});
    }
});