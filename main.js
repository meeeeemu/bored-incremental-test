import Decimal from "break_eternity.js";

if(localStorage.getItem("boredincrementaltest")){
    var parseddata = JSON.parse(localStorage.getItem("boredincrementaltest"))
}

console.log(parseddata)

if(parseddata){
    var data = {
        pointValue: new Decimal(parseddata.pointValue),
        incrementValue: new Decimal(parseddata.incrementValue),
        upgradeCost: new Decimal(parseddata.upgradeCost),
        intervalCost: new Decimal(parseddata.intervalCost),
        intervalTime: parseddata.intervalTime,
        decimalPlaceCount: parseddata.decimalPlaceCount,
        rebirthMultiplier: new Decimal(parseddata.rebirthMultiplier),
        rebirthCounts: new Decimal(parseddata.rebirthCounts)
    }
} else {
    var data = {
        pointValue: new Decimal(0),
        incrementValue: new Decimal(0.001),
        upgradeCost: new Decimal(0.01),
        intervalCost: new Decimal(0.001),
        intervalTime: 500,
        decimalPlaceCount: 6,
        rebirthMultiplier: new Decimal(1),
        rebirthCounts: new Decimal(0)
    }
}


document.getElementById("currentPointIncrement").innerHTML = data.incrementValue;

document.getElementById("upgradeCost").innerHTML = data.upgradeCost;

document.getElementById("currentPointInterval").innerHTML = data.intervalTime;

function save() {
    localStorage.setItem("boredincrementaltest", JSON.stringify(data));
  }

function deleteSave() {
    localStorage.removeItem("boredincrementaltest");
}

function handleVisibilityChange() {
    if (document.visibilityState === "hidden") {
      save();
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

document.getElementById("deleteSave").addEventListener('click', function () {
    const confirmed = window.confirm("are you shore you wanna delete it");
    if (confirmed) {
      alert("save is gonezo");
      deleteSave();
      location.reload();
    }
});

document.getElementById("saveButton").addEventListener('click', function () {
    save();
});

document.getElementById("deleteSave").addEventListener('click', function () {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
});

document.getElementById("saveButton").addEventListener('click', function () {
    document.addEventListener("visibilitychange", handleVisibilityChange);
});

function mainIncrement(){
    data.pointValue = (data.pointValue.add(data.incrementValue.multiply(data.rebirthMultiplier)));
    document.getElementById("pointValue").innerHTML = data.pointValue.toPrecision(data.decimalPlaceCount);
    if(document.getElementById("pointCostInterval")){
        document.getElementById("pointCostInterval").innerHTML = ((data.pointValue.multiply(16))/50).toPrecision(data.decimalPlaceCount);
    }
    if(data.intervalTime==1){
        document.getElementById("upgradeInterval").innerText = "he's going fast (max)";
        document.getElementById("upgradeInterval").style = "cursor: not-allowed; pointer-events: none;";
    }
    document.getElementById('rebirthPotential').innerHTML = data.rebirthMultiplier.toPrecision(data.decimalPlaceCount)
}

document.getElementById('rebirthButton').addEventListener('click', function(){
    if(data.pointValue>=1e6){
        data.rebirthMultiplier = data.rebirthMultiplier.add(0.1);
        document.getElementById('rebirthPotential').innerHTML = data.rebirthMultiplier.toPrecision(data.decimalPlaceCount)
        data.pointValue = new Decimal(0);
        data.incrementValue = new Decimal(0.001);
        data.upgradeCost = new Decimal(0.01);
        data.intervalCost = new Decimal(0.001);
        data.intervalTime = 500;
        data.decimalPlaceCount = 6;
        data.rebirthCounts = data.rebirthCounts.add(1);
        document.getElementById('currentPointIncrement').innerHTML = data.incrementValue.multiply(data.rebirthMultiplier).toPrecision(data.decimalPlaceCount);
        document.getElementById('upgradeCost').innerHTML = data.upgradeCost.toPrecision(data.decimalPlaceCount);
        document.getElementById('currentPointInterval').innerHTML = data.intervalTime;
        document.getElementById("upgradeInterval").innerHTML = "convert <div id='pointCostInterval'>0</div> to lower interval value";
        document.getElementById("upgradeInterval").style = "";
    }
})



document.getElementById("upgradeIncrement").addEventListener('click', function(){
    console.log(data.pointValue.cmp(data.upgradeCost));
    if(data.pointValue.cmp(data.upgradeCost)==1){
        data.pointValue = data.pointValue.subtract(data.upgradeCost);
        data.upgradeCost = (data.upgradeCost.multiply(3.141)).div(data.rebirthMultiplier);
        data.incrementValue = data.incrementValue.multiply(2.482345);
        document.getElementById("upgradeCost").innerHTML = data.upgradeCost.toPrecision(data.decimalPlaceCount);
        document.getElementById("currentPointIncrement").innerHTML = data.incrementValue.toPrecision(data.decimalPlaceCount);
    }
})

document.getElementById("upgradeInterval").addEventListener('click', function(){
    console.log(data.pointValue.cmp(data.upgradeCost));
    if(data.pointValue){
        data.intervalTime = data.intervalTime - (data.pointValue.multiply(16))/50;
        if(data.intervalTime<=0){
            data.intervalTime = 1;
            document.getElementById("upgradeInterval").innerText = "he's going fast (max)";
            document.getElementById("upgradeInterval").style = "cursor: not-allowed; pointer-events: none;";
        } else {
            data.pointValue = data.pointValue.subtract(data.pointValue);
        }
        document.getElementById("currentPointInterval").innerHTML = data.intervalTime;
    }
})

function mainGameLoop(){
    mainIncrement();
    let intervalTime = data.intervalTime;
    setTimeout(mainGameLoop, intervalTime);
}
mainGameLoop()