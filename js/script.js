// ゲーム全体の定義
var isKeyBlock = false; //自動進行中などのためのキー入力のブロックフラグ
var levelupMessageCount = 0;
var selectMenuId = 0; //メニュー選択位置
var maxMenuNum = 4;
var DEFAULT_GUARD_POINT = 200; //防御で付加されるダメージ現象数

var screenModeMenu = "menu";
var screenModeBattle = "battle";
var screenMode = screenModeMenu;
var MenuModeNormal=0;
var MenuModeBattleSelect=1;
var menuMode = MenuModeNormal;

// キャラクターデータ設計図
class Unit {
  constructor(name, level, hp, mp, atc, def, spd) {
    this.name = name;
    this.level = level;
  	this.maxhp = hp;
  	this.hp = hp;
    this.mp = mp;
  	this.atc = atc;
    this.def = def;
    this.spd = spd;
    this.once_guard =  0;
  }
}

// 味方キャラクターデータ
class Character extends Unit {
  constructor(name, level, hp, mp, atc, def, spd) {
    super(name,level,hp,mp,atc,def,spd);
  }
}

var character1 = new Character("キャラA", 99, 999, 999, 255, 255, 255);
var character2 = new Character("ゲスト1", 99, 9999, 9999, 255, 255, 255);
var character3 = new Character("ゲスト2", 99, 9999, 9999, 255, 255, 255);
var character4 = new Character("ゲスト3", 99, 9999, 9999, 255, 255, 255);

// 敵キャラクターデータ
class Slime extends Unit {
  constructor(name, level, hp, mp, atc, def, spd) {
    super(name, level, hp, mp, atc, def, spd); 
    this.skill =  "いてつくはどう";
    this.type =  "normal";
    this.imagepath =  './img/monster/slime.png';
    this.item = "やくそう";
  }
}

var slime1 = new Slime("スラぞう", 99, 4999, 20, 600, 10, 10);
var slime2 = new Slime("スラりん", 50, 2000, 10, 300, 10, 10);
var slime3 = new Slime("スラぼう", 50, 2000, 10, 300, 10, 10);

class Malzeno extends Unit {
  constructor(name, level, hp, mp, atc, def, spd) {
    super(name, level, hp, mp, atc, def, spd); 
    this.skill =  "咆哮";
    this.type =  "boss";
    this.imagepath =  "./img/monster/Malzeno.png";
    this.item = "回復薬グレート";
  }

}

var malzeno = new Malzeno("爵銀龍メルゼナ", 100, 28500, 20, 500, 10, 10);

class woman extends Unit {
  constructor(name, level, hp, mp, atc, def, skill_atc, spd) {
    super(name, level, hp, mp, atc, def, skill_atc, spd); 
    this.skill =  "万物流転 -パンタ・レイ-";
    this.type =  "woman";
    this.imagepath =  "./img/monster/Malzeno.png";
    this.item = "回復薬グレート";
  }
}

var woman1 = new woman("幡田 零", 99, 9999, 999, 400, 10, 600, 10);
var woman2 = new woman("幡田 久遠", 999, 99999, 9999, 500, 10, 999, 10);

//5.enemy配列を作る
var enemyArray = [slime1, slime2, slime3, malzeno, woman1, woman2]; //モンスターが全部はいった配列を作っておく

//音声再生をすべて受け持つクラス
class AudioPlayer {

  soundParamList = {
    /******************************************** BGM ********************************************/

    // 店BGM
    "torneko":        { "filename":"sound/torneko_intro.mp3",        "volume":1, "loop":true, },
    
    // 宿屋BGM
    "inn":            { "filename":"sound/inn.wav",                  "volume":1, "loop":false, },

    // 戦闘BGM
    "normal":         { "filename":"sound/dq4_btl_fc.mp3",           "volume":1, "loop":true, },
    "normal2":        { "filename":"sound/dq4_btl_fc.mp3",           "volume":1, "loop":true, },
    "boss":           { "filename":"sound/malzeno_Battle_Theme.mp3", "volume":1, "loop":true, },
    "woman1":         { "filename":"sound/can_cry_Instrumental.mp3", "volume":0.3, "loop":true, },
    "woman2":         { "filename":"sound/can_cry.mp3",              "volume":1, "loop":true, },

    /******************************************** SE ********************************************/

    // カーソル選択SE
    "cursor":         { "filename":"sound/cursor.wav",               "volume":1, "loop":false, },
    "select":         { "filename":"sound/select.wav",               "volume":1, "loop":false, },

    // 戦闘SE
    "attack":         { "filename":"sound/attack.mp3",               "volume":0.3, "loop":false, },
    "enemy_attack":   { "filename":"sound/enemy_attack.mp3",         "volume":0.3, "loop":false, },
    "being_attacked": { "filename":"sound/being_attacked.mp3",       "volume":0.3, "loop":false, },
    "heal":           { "filename":"sound/heal.mp3",                 "volume":0.3, "loop":false, },
    "win":            { "filename":"sound/win.wav",                  "volume":1, "loop":false, },
    "levelup":        { "filename":"sound/levelup.wav",              "volume":1, "loop":false, },
    "flee":           { "filename":"sound/flee.mp3",                 "volume":1, "loop":false, },
    "gameover":       { "filename":"sound/gameover.wav",             "volume":1, "loop":false, },

    // 特技SE
    "freezing_waves": { "filename":"sound/freezing_waves.mp3",       "volume":0.3, "loop":false, },
    "malzeno_roar":   { "filename":"sound/malzeno_roar.mp3",         "volume":1, "loop":false, },

  }

  constructor() {
    this.se=null;
    this.bgm=null;
  }

  /*
  //BGM再生用関数
  playBGM(filename, volume=1.0, loop=true) {
    if( this.bgm!=null ){
      //再生中のものリセット
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
    //新規再生
    this.bgm = new Audio(filename);
    this.bgm.volume = volume;
    this.bgm.play();
    this.bgm.loop = loop;
  }
  */

  playBGM2( soundParamName ) {
    var soundParam = this.soundParamList[soundParamName];

    if( this.bgm != null ) {
      //再生中のものリセット
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }

    //新規再生
    this.bgm = new Audio( soundParam.filename );
    this.bgm.volume = soundParam.volume;
    this.bgm.play();
    this.bgm.loop = soundParam.loop;
  }

  //再生中のBGMをストップ
  stopBGM() {
    this.bgm.pause();
    this.se.currentTime = 0;
  }

  /*
  playSE(filename, volume=1.0) {

    //新規再生
    this.se = new Audio(filename);
    this.se.volume = volume;
    this.se.play();
  }
  */

  playSE2( soundParamName ) {
    var soundParam = this.soundParamList[soundParamName];

    //新規再生
    this.se = new Audio( soundParam.filename );
    this.se.volume = soundParam.volume;
    this.se.play();
  }

  stopSE() {
    this.se.pause();
  }

}

var audioPlayer = new AudioPlayer();

//構造体（オブジェクト）でプレイヤーステータスを管理
var player1 = {
  name: "キャラA",
  level: 99,
  hp: 999,
  mp: 999,
  maxhp: 999,
  atc: 255,
  def: 255,
  spd: 255,
  once_guard: 0,
}
var player2 = {
  name: "ゲスト1",
  level: "??",
  hp: "???",
  mp: "???",
  maxhp: 50,
  atc: 255,
  def: 255,
  spd: 255,
  once_guard: 0,
}
var player3 = {
  name: "ゲスト2",
  level: "??",
  hp: "???",
  mp: "???",
  maxhp: 50,
  atc: 255,
  def: 255,
  spd: 255,
  once_guard: 0,
}
var player4 = {
  name: "ゲスト3",
  level: "??",
  hp: "???",
  mp: "???",
  maxhp: 50,
  atc: 255,
  def: 255,
  spd: 255,
  once_guard: 0,
}

var enemy1 = {
  // スライムのステータス定義
  name: "スライム",
  level: 99,
  hp: 9999,
  mp: 20,
  maxhp: 5000,
  atc: 300,
  skill: "いてつくはどう",
  type: "normal",
  imagepath: "./img/monster/slime.jpg",
  item: "やくそう",
}
var enemy2 = {
  // メルゼナのステータス定義
  name: "爵銀龍メルゼナ",
  level: 100,
  hp: 28500,
  mp: 20,
  maxhp: 28500,
  atc: 500,
  skill: "咆哮",
  type: "boss",
  imagepath: "./img/monster/Malzeno.png",
  item: "回復薬グレート"
}
var enemy3 = {
  // メルゼナのステータス定義
  name: "幡田 零",
  level: "99",
  hp: 9999,
  mp: 999,
  maxhp: 9999,
  atc: 400,
  skill: "万物流転 -パンタ・レイ-",
  skill_atc: 600,
  type: "woman",
  imagepath: "./img/monster/crystar-rei.png",
  item: "スイートチョコ"
}
var enemy4 = {
  // メルゼナのステータス定義
  name: "幡田 久遠",
  level: "???",
  hp: 99999,
  mp: 999,
  maxhp: 99999,
  atc: 600,
  skill: "万物流転 -パンタ・レイ-",
  skill_atc: 899,
  type: "woman2",
  imagepath: "./img/monster/crystar-kuon.png",
  item: "スイートチョコ"
}

var enemy = enemy2;

var heal_hp = 500;

// 戦闘初期化処理
menu_init();
hideLogin();

// キーボード操作
document.onkeydown = function(keyEvent) {

  //メニューとバトル共用キー処理
  //「keyCode」は非推奨とVSコードに出るが今回は無視する
  if (keyEvent.keyCode==37) { //37はキーボードの左キー
    document.getElementById("game_control").value = "←";
    console.log("←が入力されました。")
  }
  if (keyEvent.keyCode==38) { //38はキーボードの上キー
    document.getElementById("game_control").value = "↑";

    selectMenuId--;
    if( selectMenuId < 0 ) selectMenuId = (maxMenuNum - 1);
    update();
    console.log("↑が入力されました。")
  }
  if (keyEvent.keyCode==39) { //39はキーボードの右キー
    document.getElementById("game_control").value = "→";
    console.log("→が入力されました。")
  }
  if (keyEvent.keyCode==40) { //40はキーボードの下キー
    document.getElementById("game_control").value = "↓";

    selectMenuId++;
    if( selectMenuId >= maxMenuNum ) selectMenuId = 0;
    update();
    console.log("↓が入力されました。")
  }
  if( screenMode==screenModeBattle ){

    //バトル画面用キー処理
    if (keyEvent.keyCode==13) { //13はキーボードのEnterキー
      if( levelupMessageCount>=1 ){
        if( levelupMessageCount==1 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">HPが 3 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==2 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">MPが 2 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==3 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">こうげきりょくが 5 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==4 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">ぼうぎょりょくが 4 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==5 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">すばやさが 2 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==6 ){
          audioPlayer.playSE2("cursor");
          document.getElementById("message").innerHTML = '<span class="message">戦闘を終了します Enterキーを 押してください</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==7 ){
          audioPlayer.playSE2("cursor");
          levelupMessageCount = 0;
          enemy.hp = enemy.maxhp;
          var enemy_death = document.getElementById('enemy_div');
          enemy_death.style.display = "block";
          shadow.classList.add("shadow");
          isKeyBlock=false;
          menu_init();
          audioPlayer.playBGM2("torneko");
        }
      }else if(enemy.hp <= 0) {
        audioPlayer.playSE2("cursor");
        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は けいけんち 10ポイント かくとくした！</span>';
        var timer = setTimeout( function () {
          player1.level += 1;
          update();
          audioPlayer.playSE2("levelup");
          document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は レベル'+player1.level+'に あがった！</span>';
          levelupMessageCount = 1;
        } , 1000 );
      } else {
        doCommand(selectMenuId);
      }
    }

  } else if ( menuMode==MenuModeBattleSelect ) {

    //メニュー画面用キー処理
    if (keyEvent.keyCode==13) { //13はキーボードのEnterキー
      doCommandSelect(selectMenuId);
    }

  } else if ( screenMode==screenModeMenu ) {

    //メニュー画面用キー処理
    if (keyEvent.keyCode==13) { //13はキーボードのEnterキー
      doCommandMenu(selectMenuId);
    }

  }

}

// タッチ操作
function activemenu(menuNo){ // メニュー選択
  selectMenuId = menuNo;
  doCommandMenu(selectMenuId);
}
function activeSelectmenu(menuSelectNo){ // たたかいますか？の選択
  selectMenuId = menuSelectNo;
  doCommandSelect(selectMenuId);
}
function battlemenu(menuNo) {
  command_id = menuNo;
  doCommand(command_id);
}


// 戦闘コマンド実行
function doCommand(command_id) { // doComand=関数名 command_id=第一引数

  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  // document.getElementById("game_control").value = "コマンド番号:" + command_id; // game_controlというdocumentオブジェクト 各switch文内のcommand_idと連動してブラウザ上で操作できる

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 0: // たたかう
      audioPlayer.playSE2("cursor");
      playerAttack(player1);
    break;

    case 1: // ぼうぎょ
      isKeyBlock=true;
      player1.once_guard = DEFAULT_GUARD_POINT;
      audioPlayer.playSE2("cursor");
      document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は みをまもっている！</span>';
      var timer = setTimeout( function () {
        playerAttack(player2);
      } , 800 );
    break;

    case 2: // どうぐ
      isKeyBlock=true;
      audioPlayer.playSE2("cursor");
      var display_heal_value = heal_hp; //表示用回復値（最大値を超えた範囲の回復量は含めない）
      player1.hp += heal_hp;
      if( player1.hp > player1.maxhp ) {

        display_heal_value = heal_hp - (player1.hp - player1.maxhp); //表示用回復値から、最大値はみ出た分をひく
        player1.hp = player1.maxhp;

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた<br> '+enemy.item+' をつかった！<br>HP が '+display_heal_value+' かいふくした</span>';

        var timer = setTimeout( function () {
          audioPlayer.playSE2("heal");
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);  
          } , 800 );
  
        } , 500 );

      } else if(player1.hp < player1.maxhp ) {

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた<br> '+enemy.item+' をつかった！<br>HP が '+heal_hp+' かいふくした</span>';

        var timer = setTimeout( function () {
          audioPlayer.playSE2("heal");
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);
          } , 800 );
  
        } , 500 );

      }
    break;

    case 3: // にげる
      isKeyBlock=true;
      audioPlayer.playSE2("cursor");
      audioPlayer.playSE2("flee");

      nandNo = Math.floor(Math.random() * 10) //０か１のランダム
      if( nandNo <= 5 ){
        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は にげだした！</span>';
        var timer = setTimeout( function () {
          audioPlayer.stopBGM();
          audioPlayer.stopSE();
          enemy.hp = enemy.maxhp;
          isKeyBlock=false;
          menu_init();
          audioPlayer.playBGM2("torneko");
        } , 1300 );

      } else {
        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は まわりこまれてしまった！</span>';
        var timer = setTimeout( function () {
          enemyAttack();
        } , 1300 );
      }
    break;

    default:
      break;

  }

}
//メニュー画面用のdoCommand
function doCommandMenu(command_id) { // doComandMenu=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 0: //メニューの１番めのコマンド
      audioPlayer.playSE2("select");
      enemy = enemy1;
      showSelect();
    break;

    case 1: //メニューの2番めのコマンド
      audioPlayer.playSE2("select");
      enemy = enemy2;
      showSelect();

      /*
      if(audioPlayer.playBGM()) {
        audioPlayer.stopBGM();
        battle_init(enemy2);
      } else {
        battle_init(enemy2);
      }
      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;
      
      // showSelect();
      update();
      console.log("メニュー２番め押下");
      */

    break;

    case 2: //メニューの3番めのコマンド
      audioPlayer.playSE2("select");

      var nandNo = Math.floor(Math.random() * 10) //０か１のランダム
      if( nandNo <= 1 ){
        enemy = enemy4;
      } else {
        enemy = enemy3;
      }

      showSelect();

      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;
      // update();
      // console.log("メニュー３番め押下");

    break;

    case 3: //メニューの4番めのコマンド
    audioPlayer.playSE2("cursor");
      console.log("メニュー４番め押下");
    break;

    case 4: //メニューの5番めのコマンド
      audioPlayer.playSE2("cursor");
      isKeyBlock=true;
      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;
      audioPlayer.playBGM2("inn");
      document.getElementById("fade").className = "fade-out";
      player1.hp = player1.maxhp;

      var timer = setTimeout( function () {
        document.getElementById("fade").className = "fade-in";
        audioPlayer.playBGM2("torneko");
        document.getElementById("message2").innerHTML = '<span class="message">'+player1.name+' 様 疲れは取れましたか？<br>他に ご用件はございますか？</span>';
        
        isKeyBlock=false;
      } , 3500 );

      console.log("メニュー５番め押下");
    break;

    case 5: //メニューの6番めのコマンド
    audioPlayer.playSE2("cursor");
      console.log("メニュー６番め押下");
    break;

    default:
    break;

  }
}
function doCommandSelect(command_id) { // doComand=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 0: //メニューの１番めのコマンド
      audioPlayer.playSE2("cursor");
      isKeyBlock=true;
      closeSelect();
      var timer = setTimeout( function () {
        document.getElementById("flash").className = "flash";
      }, 100);
      if (enemy.type == "normal") {
        audioPlayer.playBGM2( "normal" );
      } else if (enemy.type == "boss") {
        audioPlayer.playBGM2( "boss" );
      } else if (enemy.type == "woman") {
        audioPlayer.playBGM2( "woman1" );
      } else if (enemy.type == "woman2") {
        audioPlayer.playBGM2( "woman2" );
      }

      var timer = setTimeout( function () {
        document.getElementById("fade").className = "fade-out";
      } , 600 );
      
      var timer = setTimeout( function () {
        // document.getElementById("id_circle-right-hidden").style.animationPlayState = "running";
        // document.getElementById("id_circle-left-hidden").style.animationPlayState = "running";
        // document.getElementById("id_circle-wrap").className = "circle-wrap";
        // document.getElementById("id_circle-right").className = "circle-right";
        // document.getElementById("id_circle-right-hidden").className = "circle-right-hidden";
        // document.getElementById("id_circle").className = "circle";
        // document.getElementById("id_circle-left").className = "circle-left";
        // document.getElementById("id_circle-left-hidden").className = "circle-left-hidden";
      } , 1000 );

      var timer = setTimeout( function () {
        document.getElementById("fade").className = "fade-in";
        battle_init(enemy);
        isKeyBlock=false;
        update();
      } , 2500 );

      console.log("メニュー１番め押下");
    break;

    case 1:
      audioPlayer.playSE2("cursor");
      closeSelect();
    break;

    default:
    break;

  }
}

function showSelect() {
  hideCursorMenu();
  // document.getElementById("select").innerHTML = '<span class="message">'+enemy.name+'と たたかいますか？</span>';
  menuMode = MenuModeBattleSelect;
  maxMenuNum = 2;
  selectMenuId = 0;
  update();
  // const loginForm = document.getElementById("select");
  // // blockで表示
  // loginForm.style.display ="block";
  //   $("body").css("overflow-y", "hidden");     

    // battle_init(enemy1);
    // update();
    // console.log("メニュー１番め押下");
}
function closeSelect() {
  menuMode = MenuModeNormal;
  maxMenuNum = 6;
  selectMenuId = 0;
  update();
}
function hideLogin() {
  var loginForm = document.getElementById("select");
  // noneで非表示
  loginForm.style.display ="none";
  $("body").css("overflow-y", "visible");
}

//攻撃するプレイヤーobjectを引数で受け取り、そのplayerの攻撃処理を行う
// function playerAttack(playerName) {
function playerAttack(player) {

  isKeyBlock=true;
  //以下のように、同SEを再生中にさらに再生しようとして失敗するのを防ぐには、pause+再生時間リセット > play()とする必要がある。
  // audioPlayer.stopSE();
  // attack.pause();
  // attack.currentTime = 0;

  var timer = setTimeout( function () {
    audioPlayer.playSE2("attack");
  } , 100 );

  console.log("se attack再生");
  var enemy_div = document.getElementById("enemy_div");
  var shadow = document.getElementById('shadow');
  var enemy_death = document.getElementById('enemy_div');

  player.once_guard = 0; //once_guardはターン開始時（現状は攻撃時で処理）に解除
  console.log("キャラ"+player.name+"の攻撃ターン");

  var rand_value = Math.floor(Math.random() * 100); // ０〜１０のランダム
  var damage = player.atc;
  damage += rand_value;
  enemy.hp = enemy.hp - damage;
  document.getElementById("message").innerHTML = '<span class="message">'+player.name+' の こうげき！<br>'+enemy.name+' に '+damage+' のダメージ！</span>';

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 1");

  var timer = setTimeout( function () {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 2");
    update();
    enemy_div.classList.add("enemy_receive_damage");
    shadow.classList.add("enemy_receive_damage");

    // 死亡チェック
    if (enemy.hp <= 0) {
      isKeyBlock=true;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 3");
      enemy.hp = 0;
      update();

      // dq4_btl_fc.pause();
      // dq4_btl_fc.currentTime = 0;
      // Malzeno_Battle_Theme.pause();
      // Malzeno_Battle_Theme.currentTime = 0;
      // can_cry.pause();
      // can_cry.currentTime = 0;
      // can_cry_Instrumental.pause();
      // can_cry_Instrumental.currentTime = 0;
      var timer = setTimeout( function () {
        audioPlayer.stopBGM();
        audioPlayer.stopSE();
        audioPlayer.playSE2("win");
        enemy_death.style.display = "none";
        enemy_div.classList.remove("enemy_receive_damage");
        shadow.classList.remove("enemy_receive_damage");
        shadow.classList.remove("shadow");  
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' を たおした！</span>';
      } , 500 );

      return;

    }

    //ダメージアニメ終了までのタイマーセット
    var timer = setTimeout( function () {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 5");
      enemy_div.classList.remove("enemy_receive_damage");
      shadow.classList.remove("enemy_receive_damage");

      if (player.name == player1.name) {
        playerAttack(player2);
      }else if (player.name == player2.name) {
        enemyAttack();
      }

    } , 500 ); //再生中にさらに再生しようとしたら失敗するのではないか？と考えここの時間を長くしてみると、attack.play()が２回目も正常に再生された。wavファイルの再生中にさらに同ファイルを再生しようとすると失敗するようだ。

  } , 900 );

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 4");

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 6");
}
function enemyAttack() {

  var friend_div = document.getElementById("friend-div");
  var freezing_waves = document.getElementById('effect');
  var effect = document.getElementById('effect');
  var nandNo = Math.floor(Math.random() * 10) //０か１のランダム

  if( nandNo <= 7 ){
    audioPlayer.playSE2("enemy_attack");
    var damage = enemy.atc;
    var rand_value = Math.floor(Math.random() * 100); // ０〜１０のランダム
    damage += rand_value;
    damage -= player1.def;
    damage -= player1.once_guard;
    if( damage < 0 ) {
      damage = 0; //防御強すぎてダメージがマイナスにならないよう０でリミットつける
    }
    player1.hp -= damage;
    player1.once_guard = 0;
    document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' の こうげき<br>'+player1.name+' に '+damage+' のダメージ！</span>';

    var timer = setTimeout( function () {
      audioPlayer.playSE2("being_attacked");
      update();
      if( player1.hp <= 0) {
        player1.hp = 0;
        update();
      }
      friend_div.classList.add("shake");
  
      var timer = setTimeout( function () {
        friend_div.classList.remove("shake");

          // 死亡チェック
          if (player1.hp <= 0) {
            audioPlayer.stopBGM();
            // dq4_btl_fc.pause();
            // dq4_btl_fc.currentTime = 0;
            // Malzeno_Battle_Theme.pause();
            // Malzeno_Battle_Theme.currentTime = 0;
            // can_cry.pause();
            // can_cry.currentTime = 0;
            // can_cry_Instrumental.pause();
            // can_cry_Instrumental.currentTime = 0;
            audioPlayer.playSE2("gameover");
            document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';

              var timer = setTimeout( function () {
                menu_init();
                enemy.hp = enemy.maxhp;
                player1.hp = player1.maxhp;
                audioPlayer.playBGM2("torneko", 0.5, true);
                isKeyBlock = false;
              } , 7000 );

            return;
          }

        isKeyBlock = false;
  
      } , 500 );
  
    } , 500 );

  }else{

    var timer = setTimeout( function () {

      if ( enemy == enemy1) {
        audioPlayer.playSE2("freezing_waves");
        freezing_waves.classList.add("effect_freezing_waves");
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  
      } else if ( enemy == enemy2 ) {
        audioPlayer.playSE2("malzeno_roar");
        freezing_waves.classList.add("effect_freezing_waves");
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  
      } else if ( enemy == enemy3 ) {
        audioPlayer.playSE2("freezing_waves");
        effect.classList.add("effect_panta_rhei_cutin");

        var timer = setTimeout( function () {
          effect.classList.remove("effect_panta_rhei_cutin");
        } ,3800);

        var damage = enemy.skill_atc;
        var rand_value = Math.floor(Math.random() * 100);
        damage += rand_value;
        damage -= player1.def;
        damage -= player1.once_guard;
        if( damage < 0 ) {
          damage = 0;
        }
        player1.hp -= damage;
        player1.once_guard = 0;

        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>'+player1.name+' に '+damage+' のダメージ！</span>';
    
        var timer = setTimeout( function () {
          audioPlayer.playSE2("being_attacked");
          update();
          if( player1.hp <= 0) {
            player1.hp = 0;
            update();
          }
          friend_div.classList.add("shake");
      
          var timer = setTimeout( function () {
            friend_div.classList.remove("shake");
    
              // 死亡チェック
              if (player1.hp <= 0) {
              audioPlayer.stopBGM();
              // dq4_btl_fc.pause();
              // dq4_btl_fc.currentTime = 0;
              // Malzeno_Battle_Theme.pause();
              // Malzeno_Battle_Theme.currentTime = 0;
              // can_cry.pause();
              // can_cry.currentTime = 0;
              // can_cry_Instrumental.pause();
              // can_cry_Instrumental.currentTime = 0;
              audioPlayer.playSE2("gameover");
              document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';
    
                var timer = setTimeout( function () {
                  menu_init();
                  enemy.hp = enemy.maxhp;
                  player1.hp = player1.maxhp;
                  audioPlayer.playBGM2("torneko", 0.5, true); 
                  isKeyBlock = false;
                } , 7000 );
    
              return;
              }
    
            isKeyBlock = false;
      
          } , 400 );
        } , 500 );

      } else if ( enemy == enemy4 ) {

        audioPlayer.playSE("freezing_waves");
        effect.classList.add("effect_panta_rhei_cutin");

        var timer = setTimeout( function () {
          effect.classList.remove("effect_panta_rhei_cutin");
        } ,3800);

        effect.classList.add("effect_panta_rhe_angelray");        

        var damage = enemy.skill_atc;
        var rand_value = Math.floor(Math.random() * 100);
        damage += rand_value;
        damage -= player1.def;
        damage -= player1.once_guard;
        if( damage < 0 ) {
          damage = 0;
        }
        player1.hp -= damage;
        player1.once_guard = 0;
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は 零 の思念を読み取り<br>'+enemy.skill+' を はなった！<br>'+player1.name+' に '+damage+' のダメージ！</span>';
    
        var timer = setTimeout( function () {
          audioPlayer.playSE2("being_attacked");
          update();
          if( player1.hp <= 0) {
            player1.hp = 0;
            update();
          }
          friend_div.classList.add("shake");
      
          var timer = setTimeout( function () {
            friend_div.classList.remove("shake");
    
              // 死亡チェック
              if (player1.hp <= 0) {
              audioPlayer.stopBGM();
              // dq4_btl_fc.pause();
              // dq4_btl_fc.currentTime = 0;
              // Malzeno_Battle_Theme.pause();
              // Malzeno_Battle_Theme.currentTime = 0;
              // can_cry.pause();
              // can_cry.currentTime = 0;
              // can_cry_Instrumental.pause();
              // can_cry_Instrumental.currentTime = 0;
              audioPlayer.playSE2("gameover");
              document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';
    
                var timer = setTimeout( function () {
                  menu_init();
                  enemy.hp = enemy.maxhp;
                  player1.hp = player1.maxhp;
                  audioPlayer.playBGM2("torneko", 0.5, true);
                  isKeyBlock = false;
                } , 7000 );
    
              return;
              }
    
            isKeyBlock = false;
      
          } , 400 );
        } , 500 );
      }

      // freezing_waves.classList.add("effect_freezing_waves");
      // document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  

      var timer = setTimeout( function () {
        freezing_waves.classList.remove("effect_freezing_waves");
        isKeyBlock = false;
      } , 4000 );

    } , 400 );
  }
}
function Experience_point() {
}

// 戦闘画面の見た目担当
function update() {

  //キャラＡ
  document.getElementById("p1name").innerHTML = player1.name;
  document.getElementById("p1level").innerHTML = 'レベル:' + player1.level;
  document.getElementById("p1hp").innerHTML = 'HP:' + player1.hp;
  document.getElementById("p1mp").innerHTML = 'MP:' + player1.mp;

  //キャラＢ
  document.getElementById("p2name").innerHTML = player2.name;
  document.getElementById("p2level").innerHTML = 'レベル:' + player2.level;
  document.getElementById("p2hp").innerHTML = 'HP:' + player2.hp;
  document.getElementById("p2mp").innerHTML = 'MP:' + player2.mp;

  //キャラＣ
  document.getElementById("p3name").innerHTML = player3.name;
  document.getElementById("p3level").innerHTML = 'レベル:' + player3.level;
  document.getElementById("p3hp").innerHTML = 'HP:' + player3.hp;
  document.getElementById("p3mp").innerHTML = 'MP:' + player3.mp;

  //キャラＤ
  document.getElementById("p4name").innerHTML = player4.name;
  document.getElementById("p4level").innerHTML = 'レベル:' + player4.level;
  document.getElementById("p4hp").innerHTML = 'HP:' + player4.hp;
  document.getElementById("p4mp").innerHTML = 'MP:' + player4.mp;

  //敵キャラ
  document.getElementById("enemyLevel").innerHTML = 'レベル:' + enemy.level;
  document.getElementById("enemyHP").innerHTML = 'HP:' + enemy.hp;
  document.getElementById("enemyMP").innerHTML = 'MP:' + enemy.mp;

  // HP減少時の画面の色替え
  if( player1.hp <= 0 ) {
    // 死亡時
    document.getElementById("friend-div").className = "battle_window_red";
    document.getElementById("character1").className = "character1_red";
    document.getElementById("character2").className = "character2_red";
    document.getElementById("character3").className = "character3_red";
    document.getElementById("character4").className = "character4_red";
    document.getElementById("battle_menu").className = "battle_menu_red";
    document.getElementById("message").className = "message_window_red";
  } else if ( player1.hp <= player1.maxhp / 2 ) {
    // ピンチ時
    document.getElementById("friend-div").className = "battle_window_yellow";
    document.getElementById("character1").className = "character1_yellow";
    document.getElementById("character2").className = "character2_yellow";
    document.getElementById("character3").className = "character3_yellow";
    document.getElementById("character4").className = "character4_yellow";
    document.getElementById("battle_menu").className = "battle_menu_yellow";
    document.getElementById("message").className = "message_window_yellow";
  } else {
    // 通常時
    document.getElementById("friend-div").className = "battle_window";
    document.getElementById("character1").className = "character1";
    document.getElementById("character2").className = "character2";
    document.getElementById("character3").className = "character3";
    document.getElementById("character4").className = "character4";
    document.getElementById("battle_menu").className = "battle_menu";
    document.getElementById("message").className = "message_window";
  }

  // メニューカーソル表示
  if(screenMode==screenModeBattle ) {

    var menu_element = document.getElementById('battle_menu' );

  } else if (screenMode==screenModeMenu ) {

    if( menuMode==MenuModeNormal ){
      var menu_element = document.getElementById('reception');
    } else if( menuMode==MenuModeBattleSelect ) {
      var menu_element = document.getElementById('select');
    }

  }

  var menu_child_div_array = menu_element.children;

  for( var i=0; i<menu_child_div_array.length; i++) {
    if( i == selectMenuId)
      menu_child_div_array[i].className = 'menu menu-active';// カーソル表示
    else
      menu_child_div_array[i].className = 'menu'; // カーソル非表示
  }

  // const button = document.getElementById('reception');
  // button.addEventListener('click', activemenu());

  // 選択肢メニューの表示非表示
  const loginForm = document.getElementById("select");

  if( menuMode==MenuModeBattleSelect ) {
    // メニュー中の戦闘しますか選択肢
    // blockで表示
    loginForm.style.display ="block";
    $("body").css("overflow-y", "hidden");
  } else {
    loginForm.style.display ="none";
  }

}
function hideCursorMenu() {
  var menu_element = document.getElementById('reception');
  var menu_child_div_array = menu_element.children;
  for( var i=0; i<menu_child_div_array.length; i++) {
    i == selectMenuId;
    menu_child_div_array[i].className = 'menu';
  }
}

//バトル初期化関数。encountEnemyを受け取って、対戦中のenemyにセットしてからバトル開始する。
function battle_init( encountEnemy ) {

  screenMode = screenModeBattle;
  maxMenuNum = 4;
  selectMenuId = 0;

  enemy = encountEnemy;

  // document.getElementById("menu_container").setAttribute('style', 'display:block;'); //メニュー画面を表示
  document.getElementById("menu_container").setAttribute('style', 'display:none;'); //メニュー画面を非表示

  document.getElementById("battle_container").setAttribute('style', 'display:block;'); //バトル画面を表示
  // document.getElementById("battle_container").setAttribute('style', 'display:none;'); //バトル画面を非表示

  document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' が あらわれた！</span>';

  if (enemy == enemy1) {

    var elem_div = document.getElementById("enemy_div");
      elem_div.classList.add("enemy-image");

    var elem_div = document.getElementById("shadow");
      elem_div.classList.add("shadow");

    var elem_image = document.getElementById("elem_image");
      elem_image.classList.remove("enemy-image2-size");
      elem_image.classList.remove("enemy-image3-size");
      elem_image.classList.remove("enemy-image4-size");
      elem_image.src = enemy.imagepath;
      elem_image.classList.add("enemy-image1-size");

    var battle_field = document.getElementById("battle_field");
      battle_field.classList.remove("battle_field2");
      battle_field.classList.remove("battle_field3");
      battle_field.classList.remove("battle_field4");
      battle_field.classList.add("battle_field");

  } else if (enemy == enemy2) {

    var elem_div = document.getElementById("enemy_div");
      elem_div.classList.remove("enemy-image");

    var elem_div = document.getElementById("shadow");
      elem_div.classList.remove("shadow");

    var elem_image = document.getElementById("elem_image");
      elem_image.classList.remove("enemy-image1-size");
      elem_image.classList.remove("enemy-image3-size");
      elem_image.classList.remove("enemy-image4-size");
      elem_image.src = enemy.imagepath;
      elem_image.classList.add("enemy-image2-size");

    var battle_field = document.getElementById("battle_field");
      battle_field.classList.remove("battle_field");
      battle_field.classList.remove("battle_field3");
      battle_field.classList.remove("battle_field4");
      battle_field.classList.add("battle_field2");

  } else if (enemy == enemy3) {

    var elem_div = document.getElementById("enemy_div");
      elem_div.classList.remove("enemy-image");

    var elem_div = document.getElementById("shadow");
      elem_div.classList.remove("shadow");

    var elem_image = document.getElementById("elem_image");
      elem_image.classList.remove("enemy-image1-size");
      elem_image.classList.remove("enemy-image2-size");
      elem_image.classList.remove("enemy-image4-size");
      elem_image.src = enemy.imagepath;
      elem_image.classList.add("enemy-image3-size");

    var battle_field = document.getElementById("battle_field");
      battle_field.classList.remove("battle_field");
      battle_field.classList.remove("battle_field2");
      battle_field.classList.remove("battle_field4");
      battle_field.classList.add("battle_field3");
    
  } else if (enemy == enemy4) {

    var elem_div = document.getElementById("enemy_div");
      elem_div.classList.remove("enemy-image");

    var elem_div = document.getElementById("shadow");
      elem_div.classList.remove("shadow");

    var elem_image = document.getElementById("elem_image");
      elem_image.classList.remove("enemy-image1-size");
      elem_image.classList.remove("enemy-image2-size");
      elem_image.classList.remove("enemy-image3-size");
      elem_image.src = enemy.imagepath;
      elem_image.classList.add("enemy-image4-size");

    var battle_field = document.getElementById("battle_field");
      battle_field.classList.remove("battle_field");
      battle_field.classList.remove("battle_field2");
      battle_field.classList.remove("battle_field3");
      battle_field.classList.add("battle_field4");
  }
}
function menu_init() {
  screenMode = screenModeMenu;
  maxMenuNum = 6;
  selectMenuId = 0;

  document.getElementById("message2").innerHTML = '<span class="message">'+player1.name+' 様 いらっしゃいませ！<br>本日は どのような ご用件ですか？<br>※本作品は音楽や効果音が再生されます。<br>事前に音量を調整してからお楽しみください。</span>';
  document.getElementById("menu_container").setAttribute('style', 'display:block;'); //メニュー画面を表示
  // document.getElementById("menu_container").setAttribute('style', 'display:none;'); //メニュー画面を非表示

  // document.getElementById("battle_container").setAttribute('style', 'display:block;'); //バトル画面を表示
  document.getElementById("battle_container").setAttribute('style', 'display:none;'); //バトル画面を非表示
  update();
}