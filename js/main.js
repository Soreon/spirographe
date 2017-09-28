/*jslint es6*/

Math.THETA = Math.PI * 2;
const canvas = document.getElementsByTagName('canvas')[0];
const context = canvas.getContext('2d');
let animationStarted = false;
let center = {x: canvas.width / 2, y: canvas.height / 2};
let fullPath = [];
let showLines = true;
let speed = 5;
let fireColors = ["#EBC137", "#E38C2D", "#DB4C2C", "#771E10", "#48110C", "#000000"];

let arrayRadius = [
    {radiusLength: 44, radiusAngle: 0, radiusAngleStep: 0.015},
];

/**
 * Dessine un cercle en *x*, *y* de rayon *radius*
 */
function circle(x, y, radius) {
    'use strict';
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.stroke();
}

/**
 * Dessine une ligne de *(x1, y1)* à *(x2, y2)* et de couleur *color*
 */
function line(x1, y1, x2, y2, color) {
    'use strict';
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

/**
 * Vide le canvas
 */
function clear() {
    'use strict';
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearPath() {
    'use strict';
    fullPath = [];
}

function addToFullPathAndDraw(x, y) {
    'use strict';

    fullPath.push({x: x - center.x, y: y - center.y});
    let previous = {x: fullPath[0].x, y: fullPath[0].y};
    let i, color = "#000000", j, k;
    for (i = 0; i < fullPath.length; i += 1) {
        j = fullPath.length - i;
        k = ((j - (j % 4)) / 4);
        if(k < fireColors.length) {
            color = fireColors[k];
        } else {
            color = fireColors[fireColors.length - 1];
        }
        line(center.x + previous.x, center.y + previous.y, center.x + fullPath[i].x, center.y + fullPath[i].y, color);
        previous.x = fullPath[i].x;
        previous.y = fullPath[i].y;
    }
}

function draw() {
    'use strict';
    let previousX = center.x;
    let previousY = center.y;
    let previousAS = 0;
    let i;

    for (i = 0; i < arrayRadius.length; i += 1) {
        arrayRadius[i].radiusAngle = (arrayRadius[i].radiusAngle + previousAS + arrayRadius[i].radiusAngleStep) % Math.THETA;
        let x1 = arrayRadius[i].radiusLength * Math.cos(arrayRadius[i].radiusAngle) + previousX;
        let y1 = arrayRadius[i].radiusLength * Math.sin(arrayRadius[i].radiusAngle) + previousY;

        if(showLines) {
            line(previousX, previousY, x1, y1, "#000000");
        }
        if(i == arrayRadius.length - 1) {
            addToFullPathAndDraw(x1, y1);
        }

        previousX = x1;
        previousY = y1;
        previousAS = previousAS + arrayRadius[i].radiusAngleStep;
    }
}

function loopAnimation() {
    'use strict';
    if (animationStarted) {
        clear();
        draw();
        requestAnimationFrame(loopAnimation);
    }
}

function startAnimation() {
    'use strict';
    animationStarted = true;
    loopAnimation();
}

function stopAnimation() {
    'use strict';
    animationStarted = false;
}

function updateCanvasSize() {
    canvas.height = canvas.scrollHeight;
    canvas.width = canvas.scrollWidth;
    center = {x: canvas.width / 2, y: canvas.height / 2};
}

function addLine(){
    let item = JSON.parse(JSON.stringify(arrayRadius[0]));
    arrayRadius.push(item);
    showMenuDataLine();
}

function removeLine() {
    if(arrayRadius.length > 1) {
        arrayRadius.pop();
        showMenuDataLine();
    }
}

function showMenuDataLine () {
    document.querySelector("#lines-container").innerHTML = "";
    var e;
    for(let i = 0; i < arrayRadius.length; i += 1 ) {
        e = document.createElement('div');
        e.setAttribute("data-id", i);
        e.innerHTML = "rl: <input type='number' data-key='radiusLength' step='0.1' value="+arrayRadius[i].radiusLength+"> ras: <input type='number' data-key='radiusAngleStep' step='0.001' value="+arrayRadius[i].radiusAngleStep+">";
        document.querySelector("#lines-container").append(e);
    }
}
// Évenements

window.addEventListener('resize', function(){
    updateCanvasSize();
}, true);

document.querySelector('#clear-path').addEventListener('click', function(){
    clearPath();
}, true);

document.querySelector('#toggle-lines').addEventListener('click', function(){
    showLines = !showLines;
}, true);

document.querySelector('#add-lines').addEventListener('click', function(){
    addLine();
}, true);

document.querySelector('#remove-lines').addEventListener('click', function(){
    removeLine();
}, true);

document.addEventListener('input', function(event){
    arrayRadius[event.target.parentNode.dataset.id][event.target.dataset.key] = parseFloat(event.target.value);
}, true);

updateCanvasSize();
showMenuDataLine();
startAnimation();


