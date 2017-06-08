// 玩家数据
//

function PlayerData(id, hasrobot, bossId, cards) {
    this.id = id;
    this.hasrobot = hasrobot;
    this.bossId = bossId;
    this.cards = cards;
    this.cardList = [];
    this.lastFocus = "";

};
PlayerData.prototype.load = function (id, data){
    this.id = id;
    this.hasrobot = data["hasrobot"];
    this.bossId = data["bossId"];
    this.cards = data["cards"];
    this.server = data["server"];
    if (Object.keys(this.cards).length == 0) {
        this.cards = {}
        for (var i = 0, l = 5; i < l; i++) {
            this.cards[i+1] = Array.apply(null, Array(28)).map(Number.prototype.valueOf,-1);
        }
    }
    if(!("bright" in this.cards)){
        this.cards["bright"] = [-1];
    }
};

PlayerData.prototype.clear = function (panel){
    this.cards[panel] = Array.apply(null, Array(28)).map(Number.prototype.valueOf,-1);
};

PlayerData.prototype.logToString = function (){
    console.log(JSON.stringify(this, null, "    "));
};
// 根据Id获取value
PlayerData.prototype.getValueById = function (cardId){
    return Math.floor(cardId/4);
}

// 根据value获取ID
PlayerData.prototype.getIdByValue = function (cardValue){
    console.log("getIdByValue===", cardValue)
    if (cardValue>=10){
        cardValue -= 10;
        cardId = cardValue*4+40;
    }
    else{
        cardId = cardValue*4;
    }
    list = new Array(0, 1, 2, 3);
    for(i in list){
        v = list[i];
        if(!this.isIdExist(cardId+Number(i))){
            console.log("getIdByValue===", Number(cardId))
            return cardId+Number(i);
        }
    }
    return -1;
    
};

PlayerData.prototype.isIdExist = function (cardId){
    for(k in this.cards){
        _cards = this.cards[k];
        if(_cards.indexOf(cardId)!=-1){
            return true
        }
    }
    return false
};

playerData = new PlayerData();
