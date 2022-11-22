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
var character2 = new Character("ゲスト", 99, 9999, 9999, 255, 255, 255);

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
    "normal": {
      "filename": "sound/dq4_btl_fc.mp3",
      "volume": 0.5,
      "loop" : false,
    },
    "normal2": {
      "filename": "sound/dq4_btl_fc.mp3",
      "volume": 0.3,
      "loop" : true,
    },
    "boss": {
      "filename": "sound/Malzeno_Battle_Theme.mp3",
      "volume": 0.5,
      "loop" : true,
    }
  }

  constructor() {
    this.se=null;
    this.bgm=null;
  }

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

  playBGM2( soundParamName ) {
  var soundParam = this.soundParamList["soundParamName"];
  this.bgm = new Audio(soundParam.filename);
  this.bgm.volume = soundParam.volume;
  this.bgm.play();
  this.bgm.loop = soundParam.loop;
  }


  //再生中のBGMをストップ
  stopBGM() {
    this.bgm.pause();
    this.se.currentTime = 0;
  }

  //SE用の再生。BGM再生と現状ほぼ変わらないが、今後の複数同時再生を考慮して分けた
  playSE(filename, volume=1.0) {
    if( this.se!=null ){
      //再生中のものリセット
      this.se.pause();
      this.se.currentTime = 0;
    }
    //新規再生
    this.se = new Audio(filename);
    this.se.volume = volume;
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
  name: "ゲスト",
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
  atc: 10000,
  skill: "いてつくはどう",
  type: "normal",
  imagepath: "./img/monster/slime.png",
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

// 受付
var torneko_intro = new Audio('sound/torneko_intro.mp3');
torneko_intro.volume = 0.5;

// 宿屋
var inn = new Audio('sound/inn.wav');
inn.volume = 0.5;

// 戦闘BGM
var dq4_btl_fc = new Audio('sound/dq4_btl_fc.mp3');
dq4_btl_fc.volume = 0.5;

var Malzeno_Battle_Theme = new Audio('sound/Malzeno_Battle_Theme.mp3');
Malzeno_Battle_Theme.volume = 0.5;

var can_cry_Instrumental = new Audio('sound/can_cry_Instrumental.mp3');
can_cry_Instrumental.volume = 0.3;

var can_cry = new Audio('sound/can_cry.mp3');
can_cry.volume = 0.2;

// 効果音
var attack = new Audio('sound/attack.mp3');
attack.volume = 0.5;

var cursor = new Audio('sound/cursor.wav');
cursor.volume = 1;

var select = new Audio('sound/select.wav');
select.volume = 1;

var flee = new Audio('sound/flee.mp3');
flee.volume = 1;

var enemy_attack = new Audio('sound/enemy_attack.wav');
enemy_attack.volume = 0.2;

var being_attacked = new Audio('sound/being_attacked.wav');
being_attacked.volume = 0.3;

var win = new Audio('sound/win.wav');
win.volume = 0.3;

var heal = new Audio('sound/heal.wav');
heal.volume = 1;

var freezing_waves_m = new Audio('sound/freezing_waves.wav');
freezing_waves_m.volume = 0.6;

var levelup = new Audio('sound/levelup.wav');
levelup.volume = 1;

var gameover = new Audio('sound/gameover.wav');
levelup.volume = 1;

var Melzeno_roar = new Audio('sound/Melzeno_roar.mp3');
Melzeno_roar.volume = 1;

// var freezing_waves = document.createElement("img");
// freezing_waves.src = "img/effect/freezing_waves.gif";

// 戦闘初期化処理
menu_init();
hideLogin();
// battle_init();




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
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">HPが 3 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==2 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">MPが 2 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==3 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">こうげきりょくが 5 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==4 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">ぼうぎょりょくが 4 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==5 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">すばやさが 2 あがった！</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==6 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">戦闘を終了します Enterキーを 押してください</span>';
          levelupMessageCount += 1;
        }else if( levelupMessageCount==7 ){
          audioPlayer.playSE("sound/cursor.wav", 1);
          levelupMessageCount = 0;
          enemy.hp = enemy.maxhp;
          var enemy_death = document.getElementById('enemy_div');
          enemy_death.style.display = "block";
          shadow.classList.add("shadow");
          isKeyBlock=false;
          menu_init();
          audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true);
        }

      }else if(enemy.hp <= 0) {
        audioPlayer.playSE("sound/cursor.wav", 1);
        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は けいけんち 10ポイント かくとくした！</span>';
        var timer = setTimeout( function () {
          player1.level += 1;
          update();
          audioPlayer.playSE("sound/levelup.wav", 1);
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

// コマンド実行
function doCommand(command_id) { // doComand=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効
  
  /*
  if (enemy.type == "normal") {
    // dq4_btl_fc.play();
  } else if (enemy.type == "boss") {
    Malzeno_Battle_Theme.play();
    // audioPlayer.playBGM("sound/Malzeno_Battle_Theme.mp3", 0.5, true);
  } else if (enemy.type == "woman") {
    can_cry_Instrumental.play();
    // audioPlayer.playBGM("sound/can_cry_Instrumental.mp3", 0.5, true);
  } else if (enemy.type == "woman2") {
    can_cry.play();
    // audioPlayer.playBGM("sound/can_cry.mp3", 0.5, true);
  }
  */

  document.getElementById("game_control").value = "コマンド番号:" + command_id; // game_controlというdocumentオブジェクト 各switch文内のcommand_idと連動してブラウザ上で操作できる

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 0: // たたかう
      audioPlayer.playSE("sound/cursor.wav", 1);
      playerAttack(player1);
    break;

    case 1: // ぼうぎょ
      isKeyBlock=true;
      player1.once_guard = DEFAULT_GUARD_POINT;
      audioPlayer.playSE("sound/cursor.wav", 1);
      document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は みをまもっている！</span>';
      var timer = setTimeout( function () {
        playerAttack(player2);
      } , 800 );
    break;

    case 2: // どうぐ
      isKeyBlock=true;
      audioPlayer.playSE("sound/cursor.wav", 1);
      var display_heal_value = heal_hp; //表示用回復値（最大値を超えた範囲の回復量は含めない）
      player1.hp += heal_hp;
      if( player1.hp > player1.maxhp ) {

        display_heal_value = heal_hp - (player1.hp - player1.maxhp); //表示用回復値から、最大値はみ出た分をひく
        player1.hp = player1.maxhp;

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた '+enemy.item+' をつかった！<br>HP が '+display_heal_value+' かいふくした</span>';

        var timer = setTimeout( function () {
          audioPlayer.playSE("sound/heal.wav", 1);
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);  
          } , 800 );
  
        } , 500 );

      } else if(player1.hp < player1.maxhp ) {

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた '+enemy.item+' をつかった！<br>HP が '+heal_hp+' かいふくした</span>';

        var timer = setTimeout( function () {
          audioPlayer.playSE("sound/heal.wav", 1);
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);
          } , 800 );
  
        } , 500 );

      }
    break;

    case 3: // にげる
      isKeyBlock=true;
      audioPlayer.playSE("sound/cursor.wav", 1); 
      var timer = setTimeout( function () { //audioPlayerが2つ連続で並ぶとカーソル音が鳴らないため、timer関数で少し遅らせる。
        audioPlayer.playSE("sound/flee.mp3", 1);
      } , 100 );
      nandNo = Math.floor(Math.random() * 10) //０か１のランダム
      if( nandNo <= 3 ){
        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は にげだした！</span>';
        var timer = setTimeout( function () {

          audioPlayer.stopBGM();
          // dq4_btl_fc.pause();
          // dq4_btl_fc.currentTime = 0
          // Malzeno_Battle_Theme.pause();
          // Malzeno_Battle_Theme.currentTime = 0
          // can_cry.pause();
          // can_cry.currentTime = 0;
          // can_cry_Instrumental.pause();
          // can_cry_Instrumental.currentTime = 0;

          enemy.hp = enemy.maxhp;
          isKeyBlock=false;
          menu_init();
          torneko_intro.currentTime = 0
          audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true);
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
function doCommandMenu(command_id) { // doComand=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 0: //メニューの１番めのコマンド
      audioPlayer.playSE("sound/select.wav", 1);
      enemy = enemy1;
      showSelect();
    break;

    case 1: //メニューの2番めのコマンド
      audioPlayer.playSE("sound/cursor.wav", 1);
      // enemy = enemy2;
      // showSelect();

      
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

    break;

    case 2: //メニューの2番めのコマンド
      audioPlayer.playSE("sound/cursor.wav", 1);
      audioPlayer.stopBGM();
      if(audioPlayer.playBGM()) {

        var nandNo = Math.floor(Math.random() * 10) //０か１のランダム
        if( nandNo <= 1 ){
          battle_init(enemy4);
        } else {
          battle_init(enemy3);
        }
      } else {
        var nandNo = Math.floor(Math.random() * 10) //０か１のランダム
        if( nandNo <= 1 ){
          battle_init(enemy4);
        } else {
          battle_init(enemy3);
        }
      }

      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;

      update();
      console.log("メニュー３番め押下");
    break;

    case 3: //メニューの3番めのコマンド
      audioPlayer.playSE("sound/cursor.wav", 1);
      console.log("メニュー４番め押下");
    break;

    case 4: //メニューの3番めのコマンド
      audioPlayer.playSE("sound/cursor.wav", 1);
      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;
      audioPlayer.playBGM("sound/inn.wav", 1, false) ;
      document.getElementById("fade").className = "fade-out";
      player1.hp = player1.maxhp;

      var timer = setTimeout( function () {
        document.getElementById("fade").className = "fade-in";
        audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true);
        document.getElementById("message2").innerHTML = '<span class="message">'+player1.name+' 様 疲れは取れましたか？<br>他に ご用件はございますか？</span>';
      } , 3500 );

      console.log("メニュー５番め押下");
    break;

    case 5: //メニューの3番めのコマンド
      audioPlayer.playSE("sound/cursor.wav", 1);
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
      audioPlayer.playSE("sound/cursor.wav", 1);
      // torneko_intro.pause();
      // torneko_intro.currentTime = 0;
      document.getElementById("fade").className = "fade-out";
      isKeyBlock=true;
      closeSelect();
      audioPlayer.playBGM2( "nomal" );
        var timer = setTimeout( function () {
          document.getElementById("fade").className = "fade-in";
          battle_init(enemy);
  
          isKeyBlock=false;
          update();
        } , 2500 );





      console.log("メニュー１番め押下");

    break;
    case 1:
      audioPlayer.playSE("sound/cursor.wav", 1);
      closeSelect();
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
    audioPlayer.playSE("sound/attack.mp3", 0.5);
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
        audioPlayer.playSE("sound/win.wav", 0.3);
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
    audioPlayer.playSE("sound/enemy_attack.wav", 0.2);
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
      audioPlayer.playSE("sound/being_attacked.wav", 0.3);
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
          audioPlayer.playBGM("sound/gameover.wav", 1);
          document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';

            var timer = setTimeout( function () {
              menu_init();
              enemy.hp = enemy.maxhp;
              player1.hp = player1.maxhp;
              audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true);
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
        audioPlayer.playSE("sound/freezing_waves.wav", 0.5);
        freezing_waves.classList.add("effect_freezing_waves");
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  
      } else if ( enemy == enemy2 ) {
        audioPlayer.playSE("sound/Melzeno_roar.mp3", 1);
        freezing_waves.classList.add("effect_freezing_waves");
        document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  
      } else if ( enemy == enemy3 ) {
        audioPlayer.playSE("sound/freezing_waves.wav", 0.5);
        effect.classList.add("effect_panta_rhei_cutin");

        var timer = setTimeout( function () {
          effect.classList.remove("effect_panta_rhei_cutin");
        } ,1800);

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
          audioPlayer.playSE("sound/being_attacked.wav", 0.3);
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
              audioPlayer.playBGM("sound/gameover.wav", 1);
              document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';
    
                var timer = setTimeout( function () {
                  menu_init();
                  enemy.hp = enemy.maxhp;
                  player1.hp = player1.maxhp;
                  audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true); 
                  isKeyBlock = false;
                } , 7000 );
    
              return;
              }
    
            isKeyBlock = false;
      
          } , 400 );
        } , 500 );

      } else if ( enemy == enemy4 ) {

        audioPlayer.playSE("sound/freezing_waves.wav", 0.5);
        effect.classList.add("effect_panta_rhei_cutin");

        var timer = setTimeout( function () {
          effect.classList.remove("effect_panta_rhei_cutin");
        } ,1800);

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
          audioPlayer.playSE("sound/being_attacked.wav", 0.3);
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
              audioPlayer.playBGM("sound/gameover.wav", 1);
              document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';
    
                var timer = setTimeout( function () {
                  menu_init();
                  enemy.hp = enemy.maxhp;
                  player1.hp = player1.maxhp;
                  audioPlayer.playBGM("sound/torneko_intro.mp3", 0.5, true);
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
    document.getElementById("battle_menu").className = "battle_menu_red";
    document.getElementById("message").className = "message_window_red";
  } else if ( player1.hp <= player1.maxhp / 2 ) {
    // ピンチ時
    document.getElementById("friend-div").className = "battle_window_yellow";
    document.getElementById("character1").className = "character1_yellow";
    document.getElementById("character2").className = "character2_yellow";
    document.getElementById("battle_menu").className = "battle_menu_yellow";
    document.getElementById("message").className = "message_window_yellow";
  } else {
    // 通常時
    document.getElementById("friend-div").className = "battle_window";
    document.getElementById("character1").className = "character1";
    document.getElementById("character2").className = "character2";
    document.getElementById("battle_menu").className = "battle_menu";
    document.getElementById("message").className = "message_window";
  }

  //メニューカーソル表示
  if(screenMode==screenModeBattle ) {

    var menu_element = document.getElementById('battle_menu' );

  } else if (screenMode==screenModeMenu ) {

    if( menuMode==MenuModeNormal ){
      var menu_element = document.getElementById('reception' );
    } else if( menuMode==MenuModeBattleSelect ) {
      var menu_element = document.getElementById('select' );
    }

  }

  var menu_child_div_array = menu_element.children;

  for( var i=0; i<menu_child_div_array.length; i++) {
    if( i == selectMenuId)
      menu_child_div_array[i].className = 'menu menu-active';//カーソル表示
    else
      menu_child_div_array[i].className = 'menu'; //カーソル非表示
  }

  //選択肢メニューの表示非表示
  const loginForm = document.getElementById("select");

  if( menuMode==MenuModeBattleSelect ) {
    //メニュー中の戦闘しますか選択肢
    // blockで表示
    loginForm.style.display ="block";
    $("body").css("overflow-y", "hidden");
  } else {
    loginForm.style.display ="none";
  }

}

function hideCursorMenu() {
  var menu_element = document.getElementById('reception' );
  var menu_child_div_array = menu_element.children;
  for( var i=0; i<menu_child_div_array.length; i++) {
    i == selectMenuId
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
      elem_image.classList.add("enemy-image-size");

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
      elem_image.classList.remove("enemy-image-size");
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
      elem_image.classList.remove("enemy-image-size");
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
      elem_image.classList.remove("enemy-image-size");
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

  document.getElementById("message2").innerHTML = '<span class="message">'+player1.name+' 様 いらっしゃいませ！<br>本日は どのような ご用件ですか？</span>';
  document.getElementById("menu_container").setAttribute('style', 'display:block;'); //メニュー画面を表示
  // document.getElementById("menu_container").setAttribute('style', 'display:none;'); //メニュー画面を非表示

  // document.getElementById("battle_container").setAttribute('style', 'display:block;'); //バトル画面を表示
  document.getElementById("battle_container").setAttribute('style', 'display:none;'); //バトル画面を非表示
  update();
}