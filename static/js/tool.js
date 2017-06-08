$('#check_gamelist').click(function(){
      console.log("check1 ======");

    // get the value of CSRF token
   config_path = $("#config_path").val()
   $.post('check_gamelist', { 
       "config_path": config_path,
   },
   function(data,status){
       console.log("check2 ======");
       console.log(JSON.stringify(data, null, "    "));
       //alert("Data: " + data + "\nStatus: " + status);
       //showMsg2();
   });
});







var url = "http://172.16.13.83:8000/gtest/"

init();

function init() {
    userId = $("#userId").val()
    if(!userId){return}
    params = {"userId": userId}
    strParams = dictToGetString(params)
  
    $.get(url+"queryAll?"+strParams,"jsonp",function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        console.log(JSON.stringify(data, null, "    "));
        bossId = data["result"]["bossId"];
        hasrobot = data["result"]["hasrobot"];
        //初始化
        //data["result"]["cards"] = [[],[0,1,2,-1,11,11,11,-1, 12,13,14,-1, 15,16,17]]
        playerData.load(userId, data["result"]);
        updateRobot(hasrobot); //初始化机器人
        updateBoss(bossId);    //初始化庄家
        //updateServer(playerData.server);    //初始化服务器
        playerData.logToString();
        for (i in playerData.cards) {
            var cards = playerData.cards[i];
            updateCards(cards, i)
        }
    });
}

function dictToGetString(info) {
    res = ""
    for (k in info) {
        v = info[k];
        if (res){
            res+="&";
        }
        res += k+"="+v;
    }
    return res
}

$("#queryAll").click(function(){
    init();
});

function updateRobot(hasrobot){
    if (hasrobot){
        $("#lbRobotStatus").text("已开启")
        $("#btnRobot").text("关闭")
        $("#btnRobot").attr("class", "btn btn-danger")
    }
    else{
        $("#lbRobotStatus").text("未开启")
        $("#btnRobot").text("开启")
        $("#btnRobot").attr("class", "btn btn-success")
    }
}

function updateBoss(bossId){
    $("label.bossId").each(function () {
        val = $(this).attr("value")
        if(val==bossId.toString()){
            $(this).attr("class", "btn btn-primary active")
        }
        else{
            $(this).attr("class", "btn btn-primary")
        }
    });
}

function updateServer(server){
    $("label.server").each(function () {
        val = $(this).attr("value")
        if(val==server.toString()){
            $(this).attr("class", "btn btn-primary active")
        }
        else{
            $(this).attr("class", "btn btn-primary")
        }
    });
}

function updateCards(cards, panel){
    index = 0
    console.log("updateCards=====", cards, index);

    $("[pos='"+panel+"']").each(function (){
        //console.log("updateCards=====", cards, index);
        cardValue = playerData.getValueById(cards[index])
        cardText = idToText(cardValue)
        if (cardText){
            $(this).text(cardText);
            redList = [1,6,9,11,16,19];
            if (redList.indexOf(Number(cardValue)) == -1){
                $(this).attr("class", "btn btn-outline btn-default btn-sm numshow");
            }
            else{
                $(this).attr("class", "btn btn-outline btn-danger btn-sm numshow");
            }
        }
        else{
            $(this).attr("class", "btn btn-outline btn-disable btn-sm numshow");
            $(this).text("空");
        }
        index+=1;
    });
}
var numshow = 1;
var numshowPanel = 1;

$("button.numshow").click(function(){
    if (!playerData.id){return}
    originPanel = numshowPanel
    originNum = numshow

    numshow = Number($(this).val());
    numshowPanel = $(this).attr("pos");
    console.log("button.numshow==="+numshow+"pos="+numshowPanel)

    for (i in playerData.cards) {
        var cards = playerData.cards[i];
        updateCards(cards, i)
    }
    updateNumShowFocus(originPanel, originNum)
});

$("#back").click(function(){
    if (!playerData.id){return}
    if ((numshow == -1) || (numshowPanel==-1)) return
    cards = playerData.cards[numshowPanel];
    cards[numshow] = -1

    playerData.cards[numshowPanel] = cards;
    updateCards(cards, numshowPanel)

    console.log("button.back=1=="+numshow)
    numshow = numshow-1;//移动到下一个
    updateNumShowFocus(numshowPanel, numshow)
    console.log("button.back=2=="+numshow)
});

function updateNumShowFocus(originPanel, originNum) {

    if ((numshow == -1) || (numshowPanel==-1)) return
    //var btn = $("button[pos='"+ originPanel +"'][value='"+ originNum +"']")
    ////var btn = $("button[pos='4'][value='0']")
    //classAttr = btn.attr("class");
    //if(playerData.lastFocus){
        ////btn.attr("class", playerData.lastFocus);
    //}

    var btn = $("button[pos='"+ numshowPanel +"'][value='"+ numshow +"']")
    classAttr = btn.attr("class");
    playerData.lastFocus = classAttr
    //btn.attr("class", classAttr+" btn-danger");
    btn.attr("class", "btn btn-danger btn-sm");
    classAttr = btn.attr("class");
    console.log("updateNumShowFocus==2==="+numshow+"pos="+numshowPanel,classAttr)
}

//开启／关闭机器人
$("#btnRobot").click(function(){
    if (!playerData.id){return}
    console.log("btnRobot.click=="+playerData)
    console.log(JSON.stringify(playerData, null, "    "));
    hasrobot = playerData.hasrobot;
    params = {"userId": $("#userId").val(), "hasrobot":hasrobot?0:1}
    strParams = dictToGetString(params)
    console.log(url+"robot?"+strParams)
    $.get(url+"robot?"+strParams,function(data,status){
        console.log(JSON.stringify(data, null, "    "));
        playerData.hasrobot = data["result"]["hasrobot"];
        updateRobot(playerData.hasrobot);
    });
    showMsg();
});

$("label.bossId").click(function(){
    if (!playerData.id){return}
    tempId = $(this).attr("value")
    console.log("value=======",tempId)

    console.log(JSON.stringify(playerData, null, "    "));

    params = {"userId": $("#userId").val(), "bossId":Number(tempId)}
    strParams = dictToGetString(params)
    console.log(url+"boss?"+strParams)
    $.get(url+"boss?"+strParams,function(data,status){
        console.log(JSON.stringify(data, null, "    "));

        playerData.bossId = data["result"]["bossId"];
        bossId = playerData.bossId;
        updateBoss(bossId);
        showMsg();
    });
});

$("label.server").click(function(){
    if (!playerData.id){return}
    console.log(this)
    console.log(this.id)
    console.log(typeof(this.id))
    value = $(this).attr("value")
    if(value == "159"){
        url = "http://111.203.187.159:7010/gtest/";
    }
    else if(value=="167"){
        url = "http://111.203.187.167:8040/gtest/";
    }

    console.log("url====", url);

    params = {"userId": $("#userId").val(), "server":Number(value)}
    strParams = dictToGetString(params)
    console.log(url+"server?"+strParams)
    $.get(url+"server?"+strParams,function(data,status){
        console.log(JSON.stringify(data, null, "    "));

        playerData.server = data["result"]["server"];
        server = playerData.server;
        updateServer(server);
    });
});

$("button.num").click(function(){
    if (!playerData.id){return}
    if ((numshow == -1) || (numshowPanel==-1)) return
    console.log("numshowPanel==="+numshowPanel)

    cards = playerData.cards[numshowPanel];
    console.log("playerData.cards1==="+cards)

    cards[numshow] = playerData.getIdByValue(Number($(this).val()))
    console.log("playerData.cards2==="+cards)

    updateCards(cards, numshowPanel)
    console.log("button.num==="+numshow)
    originNum = numshow
    numshow = numshow+1;//移动到下一个
    updateNumShowFocus(numshowPanel, originNum)
});

$("#save").click(function(){
    if (!playerData.id){return}
    playerData.logToString();

    cardsName = $("#cardsName").val()
    if(!cardsName){cardsName="默认";}

    //save
     $.post(url + "savecards",
    {
        "userId": playerData.id,
        "cards": JSON.stringify(playerData.cards),
        "cardsName": cardsName
    },
    function(data,status){
        console.log("save ======");
        console.log(JSON.stringify(data, null, "    "));
        //alert("Data: " + data + "\nStatus: " + status);
        showMsg2();
    });
});

$("#clear").click(function(){
    if (!playerData.id){return}
    playerData.clear(numshowPanel);
    playerData.logToString();
    cards = playerData.cards[numshowPanel];
    updateCards(cards, numshowPanel)
    console.log("playerData.numshowPanel==="+numshowPanel)
});

$("#quickadd").click(function(){
    $('#quickaddul').empty();
    $.get(url+"quickAddAll?"+strParams,function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        console.log(JSON.stringify(data, null, "    "));
        cardList = data["result"]
        playerData.cardList = cardList
        for (i in cardList) {
            cardsItem = cardList[i]
            var li=$("<li></li>");
            var btn=$("<button type='button' class='btn btn-primary quickItem' index="+i+">"+cardsItem["name"]+"</button>").appendTo(li);
            $("#quickaddul").append(li)
        }
    });

});
$('#quickaddul').on('click', 'button.quickItem', function(){
    console.log("button.quickItem=====")
    i = Number($(this).attr("index"))
    cardItem = playerData.cardList[i]
    playerData.cards = cardItem["cards"]
    for (i in playerData.cards) {
        var cards = playerData.cards[i];
        updateCards(cards, i)
    }

});

$("#clearAll").click(function(){
    console.log("clearAll======");
    userId = $("#userId").val()
    if(!userId){return}
    params = {"userId": userId}
    strParams = dictToGetString(params)
    $.get(url+"clearAll?"+strParams, function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        console.log(JSON.stringify(data, null, "    "));

        res = data["result"];
        if(res==1){
            init();
        };
    });
});

function idToText(id) {
    if(id == 0){
        return "一"
    }
    else if(id == 1){
        return "二"
    }
    else if(id == 2){
        return "三"
    }
    else if(id == 3){
        return "四"
    }
    else if(id == 4){
        return "五"
    }
    else if(id == 5){
        return "六"
    }
    else if(id == 6){
        return "七"
    }
    else if(id == 7){
        return "八"
    }
    else if(id == 8){
        return "九"
    }
    else if(id == 9){
        return "十"
    }
    else if(id == 10){
        return "壹"
    }
    else if(id == 11){
        return "貳"
    }
    else if(id == 12){
        return "叁"
    }
    else if(id == 13){
        return "肆"
    }
    else if(id == 14){
        return "伍"
    }
    else if(id == 15){
        return "陆"
    }
    else if(id == 16){
        return "柒"
    }
    else if(id == 17){
        return "捌"
    }
    else if(id == 18){
        return "玖"
    }
    else if(id == 19){
        return "拾"
    }
    else if(id == 20){
        return "龍"
    }
    return ""
}

$("#success-alert").hide();
$("#success-alert2").hide();
function showMsg() {
    $("#success-alert").alert();
    $("#success-alert").fadeTo(500, 500).slideUp(500, function(){
        $("#success-alert").slideUp(500);
    });   
}
function showMsg2() {
    $("#success-alert2").alert();
    $("#success-alert2").fadeTo(500, 500).slideUp(500, function(){
        $("#success-alert2").slideUp(500);
    });   
}

//$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
        //$("#success-alert").slideUp(500);
//});

