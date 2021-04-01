/*
var genid = function(){
    return idd++;
};

var Pin = function(){
    this.id = genid();
    this.connections = {};
    this.connnect = function(pin){
        connections[pin.id] = pin;
    }
};

var Component = function(){
    var pins = {};
    this.addPin = function(){
        var id = genid();
        var pin = {
            connections:{}
        };
    }
};


var Coil = function(i){
    var coil = new Component();
    var pin1 = coil.addPin();
    var pin2 = coil.addPin();
    this.calcStep = function(){
        
    }
};





var simulator = function(){
    var components = {};
    var idd = 0;
    
    this.addCoil = function(ind){
        var coil = new Component();
        var pin1 = coil.addPin();
        var pin2 = coil.addPin();
        var i = 0;
        var v = 0;
        var didt = 0;
        var dvdt = 0;
        coil.ind = ind;
        coil.calculate = function(dt){
            pin1.i = i;
            pin2.i = -i;
            pin1.v = pin2.v+v;
            
            
            var dvdt = pin1.getdvdt() - pin2.dvdt();
            var didt = pin1.getdidt() - pin2.didt();
            var v = 
        }
    };
    
    this.addCapacitor = function(cap){
        
    };
    
    
    var addCoil = function(inductance){
        
    }
}


var main = function(){
    var simulator = new Simulator();
    var coil = simulator.addCold(1);
    var capacitor = simulator.addCapacitor(1);//capacitance
    capacitor.pins[0].setVoltage(1);
    capacitor.pins[1].setVoltage(0);//default voltage set to one
    capacitor.pins[0].connect(coil.pins[0]);
    capacitor.pins[1].connect(coil.pins[1]);
    
    simulator.step(0.01);
};
*/
//thought of making a general purpose circuit simulator, but I need sleep too y' know?

var GraphCanvas = function(canvas,timerange,zoom){
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext("2d");
    var queue = [];
    var clearData = function(t){
        while(queue[0] && t-queue[0].t < timerange){//dirty implementation, just wanna go to bed
            queue.splice(0,1);
        }
    }
    this.addDataPoint = function(d,t){
        clearData();
        queue.push({d,t});
    };
    this.draw = function(t){
        ctx.clearRect(0,0,width,height);
        ctx.font = "10px arial";
        ctx.fillText("V =  1",0,20);
        ctx.fillText("V = -1",0,190);
        ctx.beginPath();
        ctx.moveTo(0,height/2);
        ctx.lineTo(width,height/2);
        ctx.strokeStyle = "#f00";
        ctx.stroke();
        ctx.strokeStyle = "#000";
        for(var i = 0; i < queue.length-1; i++){
            var d1 = queue[i].d;
            var d2 = queue[i+1].d;
            var t1 = queue[i].t;
            var t2 = queue[i+1].t;
            ctx.beginPath();
            ctx.moveTo((t-t1)*width/timerange,d1*zoom+height/2);
            ctx.lineTo((t-t2)*width/timerange,d2*zoom+height/2);
            ctx.stroke();
        }
    };
};

var CtxLiner = function(ctx){
    this.l = function(a,b,c,d){
        ctx.beginPath();
        ctx.moveTo(a,b);
        ctx.lineTo(c,d);
        ctx.stroke();
    }
}

var circuitDiagram = function(canvas){
    var width = canvas.width;
    var height = canvas.height;
    var vw = width/100/2;
    var vh = height/100;
    var ctx = canvas.getContext("2d");
    var ctxline = new CtxLiner(ctx);
    ctxline.l(10*vw,10*vh, 10*vw,45*vh);
    //blades
    ctxline.l(0*vw,45*vh, 20*vw,45*vh);
    ctxline.l(0*vw,55*vh, 20*vw,55*vh);
    
    ctxline.l(10*vw,55*vh, 10*vw,90*vh);
    ctxline.l(10*vw,90*vh, 90*vw,90*vh);
    ctxline.l(90*vw,90*vh, 90*vw,70*vh);
    ctxline.l(90*vw,30*vh, 90*vw,10*vh);
    ctxline.l(90*vw,10*vh, 10*vw,10*vh);
    //coils
    ctxline.l(90*vw,70*vh, 87.5*vw,70*vh);
    ctxline.l(90*vw,30*vh, 87.5*vw,30*vh);
    ctx.beginPath();
    ctx.arc(87.5*vw,65*vh,5*vh,-1.58,1.58);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(87.5*vw,55*vh,5*vh,-1.58,1.58);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(87.5*vw,45*vh,5*vh,-1.58,1.58);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(87.5*vw,35*vh,5*vh,-1.58,1.58);
    ctx.stroke();
    
    ctx.font = "14px arial";
    ctx.fillText("Coil inductance: 1",100*vw,30*vh);
    ctx.fillText("Capacitor capacitance: 1",100*vw,40*vh);
    ctx.fillText("Initial voltage: 1",100*vw,50*vh);
    ctx.fillText("Initial current flow: 0",100*vw,60*vh);
};


var V = 1;
var I = 0;
var L = 1;
var C = 1;
dvdt = 0;
didt = 0;
//i = C*dv/dt
//v = L*di/dt

var step = function(dt){
    didt = V/L;
    I += didt*dt;
    dvdt = -I/C;
    V += dvdt*dt;
};

circuitDiagram(document.getElementById("canvas1"));

var canvas = document.getElementById("canvas2");
canvas.width = 500;
canvas.height = 200;
var ctx = canvas.getContext("2d");
var graphCanvas = new GraphCanvas(canvas,5,80);
var previousZeroT = 0;
var previousZeroV = 0;
var previousZeroDvdt = 0;
var previousMaxT = 0;
var previousMaxV = 0;
var previousMaxDvdt = 0;

var start = 0;
var animate = function(t){
    t /= 1000;
    if(start === 0)start = t;
    var dt = t - start;
    start = t;
    var itrs = 50000;
    for(var i = 0; i < itrs; i++){
        var v0 = V;
        var dvdt0 = dvdt;
        step(dt/itrs);
        var v1 = V;
        var dvdt1 = dvdt;
        //pi detection code
        //detects 0
        if(v0 < 0 && !(v1 < 0) || !(v0 < 0) && v1 < 0){//can't use the multiplication technique because it might cause a bug
            previousZeroT = t+(dt/itrs)*i;
            previousZeroV = V;
            previousZeroDvdt = dvdt;
        }else if(dvdt0 < 0 && !(dvdt1 < 0) || !(dvdt0 < 0) && dvdt1 < 0){//dvdt 0
            previousMaxT = t+(dt/itrs)*i;
            previousMaxV = V;
            previousMaxDvdt = dvdt;
        }
    }
    
    //console.log(V);
    graphCanvas.addDataPoint(V,t);
    graphCanvas.draw(t);
    
    pi = 2*previousZeroDvdt*(previousMaxT-previousZeroT)/previousMaxV;
    console.log(pi);
    ctx.font = "20px arial";
    ctx.fillText("π = "+pi,50,20);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);



