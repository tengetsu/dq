// ゲーム全体の定義
var menu_id = 0;  // 定義
var damageElement = document.getElementById("damage");
var isKeyBlock = false; //自動進行中などのためのキー入力のブロックフラグ
var levelupMessageCount = 0;

var screenModeMenu = "menu";
var screenModeBattle = "battle";
var screenMode = screenModeMenu;

/*
// 戦闘用キャラクターデータ
class BattleCharacter {
  name = ""; // 名前
  hp = 0; // HP
  maxhp = 0; // 最大HP
  atc = 0; // 攻撃力
  def = 0; // 防御力
  speed = 0; // 素早さ
  image; // 画像

  constructor(name, hp, atc, def, speed, image) {
    this.name = name;
    this.hp = hp;
    this.maxhp = hp;
    this.atc = atc;
    this.def = def;
    this.speed = speed;
    this.image = image;
  }
}

// 戦闘管理クラス
class Battle {
  status = 0;
  progressCount = 0;
  actionOrder = [];
  message = [];

  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.nextAction();
  }
}
*/

// 主人公ステータス
// var p1name = "キャラA";
// var p1level = 99;
// var p1hp = 999;
// var p1maxhp = 999;
// var p1atc = 255;
// var p1def = 255;
// var p1spd = 255;
// var once_guard = 0;

// 魔法使いステータス
// var p2name = "キャラB";
// var p2atc = 1;

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
  name: "キャラB",
  level: 99,
  hp: 999,
  mp: 999,
  maxhp: 50,
  atc: 5,
  def: 255,
  spd: 255,
  once_guard: 0,
}

var enemy1 = {
  // スライムのステータス定義
  name: "スライム",
  level: 99,
  hp: 500,
  mp: 20,
  atc: 700,
  skill: "いてつくはどう",
  type: "normal",
  imagepath: "./img/monster/slime.png",
}

var enemy2 = {
  // メルゼナのステータス定義
  name: "爵銀龍メルゼナ",
  level: 100,
  hp: 28500,
  mp: 20,
  atc: 500,
  skill: "咆哮",
  type: "boss",
  imagepath: "./img/monster/Malzeno.png",
}

var enemy = enemy1;

var heal_hp = 500;

// 戦闘BGM
var dq4_btl_fc = new Audio('sound/dq4_btl_fc.mp3');
dq4_btl_fc.volume = 0.5;

var Malzeno_Battle_Theme = new Audio('sound/Malzeno_Battle_Theme.mp3');
Malzeno_Battle_Theme.volume = 0.5;

// 効果音
var attack = new Audio('sound/attack.mp3');
attack.volume = 0.5;

var cursor = new Audio('sound/cursor.wav');
cursor.volume = 1;

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

var freezing_waves = document.createElement("img");
freezing_waves.src = "img/effect/freezing_waves.gif";

// 戦闘初期化処理
menu_init();
// battle_init();

// キーカーソルの表示/非表示
function activemenu(id) { // activemenu=関数名 id＝第一引数

  if (menu_id == id) {    // menu_id を 引数idとする
    // 前回と同じメニューが選ばれた場合はコマンドを実行
    doCommand(id)
  } else {
    if (menu_id != 0) { 
      // 現在のメニューのカーソルを消す
      document.getElementById('menu' + menu_id).className = 'menu'; // HTML側のclass=menuと連動
    }
    //今回選ばれたメニューにカーソルを表示
    document.getElementById('menu' + id).className = 'menu menu-active';
    menu_id = id;
  }
}

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
      if (menu_id <= 1) { // menu_id が 1 以下になったら、activemenu(4)「にげる」へ
        activemenu(4);
      } else {
        activemenu(menu_id - 1); //menu_id が 4であれば「どうぐ」へ、3であれば「ぼうぎょ」へ、2であれば「たたかう」へ
      }
      console.log("↑が入力されました。")
    }

    if (keyEvent.keyCode==39) { //39はキーボードの右キー
      document.getElementById("game_control").value = "→";
      console.log("→が入力されました。")
    }

    if (keyEvent.keyCode==40) { //40はキーボードの下キー
      document.getElementById("game_control").value = "↓";
      if (menu_id >= 4) { //menu_id が 4以上になったら、activemenu(1)「たたかう」へ
        activemenu(1);
      } else {
        activemenu(menu_id + 1); //menu_id が 1であれば「ぼうぎょ」へ、2であれば「どうぐ」へ、3であれば「にげる」へ
      }
      console.log("↓が入力されました。")
    }

    if( screenMode==screenModeBattle ){

      //バトル画面用キー処理
      if (keyEvent.keyCode==13) { //13はキーボードのEnterキー
        if( levelupMessageCount>=1 ){
          if( levelupMessageCount==1 ){
            cursor.play();
            document.getElementById("message").innerHTML = '<span class="message">HPが 3 あがった！</span>';
            levelupMessageCount += 1;
          }else if( levelupMessageCount==2 ){
            cursor.play();
            document.getElementById("message").innerHTML = '<span class="message">MPが 2 あがった！</span>';
            levelupMessageCount += 1;
          }else if( levelupMessageCount==3 ){
            cursor.play();
            document.getElementById("message").innerHTML = '<span class="message">こうげきりょくが 5 あがった！</span>';
            levelupMessageCount += 1;
          }else if( levelupMessageCount==4 ){
            cursor.play();
            document.getElementById("message").innerHTML = '<span class="message">ぼうぎょりょくが 4 あがった！</span>';
            levelupMessageCount += 1;
          }else if( levelupMessageCount==5 ){
            cursor.play();
            document.getElementById("message").innerHTML = '<span class="message">すばやさが 2 あがった！</span>';
            levelupMessageCount += 1;
          }

        }else if(enemy.hp <= 0) {
          cursor.play();
          document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は けいけんち 10ポイント かくとくした！</span>';

          levelupMessageCount = 1;

          var timer = setTimeout( function () {
            player1.level += 1;
            update();
            levelup.play();
            document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は レベル'+player1.level+'に あがった！</span>';

          } , 1000 );

        } else {
          doCommand(menu_id);
        }
      }
  } else {

    //メニュー画面用キー処理
    if (keyEvent.keyCode==13) { //13はキーボードのEnterキー
      doCommandMenu(menu_id);
    }

  }


}

// コマンド実行
function doCommand(command_id) { // doComand=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  if (enemy.type == "normal") {
    dq4_btl_fc.play();
  } else {
    Malzeno_Battle_Theme.play();
  }

  document.getElementById("game_control").value = "コマンド番号:" + command_id; // game_controlというdocumentオブジェクト 各switch文内のcommand_idと連動してブラウザ上で操作できる

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 1: // たたかう
    //   isKeyBlock=true;
    //   cursor.play();
    //   attack.play();
    //   var enemy_div = document.getElementById("enemy_div");
    //   var damage = p1atc;
    //   var rand_value = Math.floor(Math.random() * 11); // ０〜１０のランダム
    //   damage += rand_value;
    //   enemyHP = enemyHP - damage;
    //   document.getElementById("message").innerHTML = '<span class="message">キャラA の こうげき！<br>スライム に '+damage+' のダメージ！</span>';

    //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 1");
    //   var timer = setTimeout( function () {
    //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 2");
    //     update();
    //     enemy_div.classList.add("enemy_receive_damage");
    //     // 死亡チェック
    //     if (enemyHP <= 0) {
    //       console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 3");
    //       dq4_btl_fc.pause();
    //       win.play();
    //       var enemy_death = document.getElementById('enemy_div');
    //       enemy_death.style.display = 'none';
    //       var shadow = document.getElementById('shadow');
    //       shadow.classList.remove("shadow");
    //       document.getElementById("message").innerHTML = '<span class="message">スライム を たおした！</span>';          
    //       return;
    //     }

    //     //ダメージアニメ終了までのタイマーセット
    //     var timer = setTimeout( function () {
    //       console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 5");
    //       enemy_div.classList.remove("enemy_receive_damage");
    //       enemyAttack();
    //     } , 400 );
  
    //   } , 900 );

    //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 4");

    //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 6");
    cursor.play();
    // playerAttack(p1name);
    playerAttack(player1);
    break;

    case 2: // ぼうぎょ
      isKeyBlock=true;
      once_guard=8;
      cursor.play();
      document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は みをまもっている！</span>';
      var timer = setTimeout( function () {
        playerAttack(player2);
      } , 900 );
      break;

    case 3: // どうぐ
      isKeyBlock=true;
      cursor.play();

      // once_guard=8;
      // damage -= once_guard;
      // if( damage < 0 ) {
      //   damage = 0; //防御強すぎてダメージがマイナスにならないよう０でリミットつける
      // }
      // p1hp -= damage;

      var display_heal_value = heal_hp; //表示用回復値（最大値を超えた範囲の回復量は含めない）

      player1.hp += heal_hp;

      // if( p1hp === p1maxhp ) {
      //   p1hp += 0; //防御強すぎてダメージがマイナスにならないよう０でリミットつける
      //   document.getElementById("message").innerHTML = '<span class="message">キャラA は もっていた やくそう をつかった！<br>HP が 0 かいふくした</span>';

      if( player1.hp > player1.maxhp ) {

        //なかなかすごいコードだが、こんなに複雑にしないでもできそう
        //というか、なぜこれでなぜ正常に動いているのだ・・・？ 魔術的だ
        // p1maxhp += heal_hp;
        // A = p1maxhp - p1hp
        // p1maxhp -= heal_hp;
        // p1hp -= heal_hp;
        // p1hp += A

        //こっちのほうがいいのではないか
        display_heal_value = heal_hp - (player1.hp - player1.maxhp); //表示用回復値から、最大値はみ出た分をひく
        player1.hp = player1.maxhp;

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた 回復薬グレート をつかった！<br>HP が '+display_heal_value+' かいふくした</span>';

        var timer = setTimeout( function () {
          heal.play();
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);
  
            /* playerAttack関数内で条件分岐してenemyAttackへの移行フラグを立てているため、削除
            var timer = setTimeout( function () {
              enemyAttack();
            } , 1300 );
            */
  
          } , 500 );
  
        } , 500 );

      } else if(player1.hp < player1.maxhp ) {

        document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は もっていた 回復薬グレート をつかった！<br>HP が '+heal_hp+' かいふくした</span>';

        var timer = setTimeout( function () {
          heal.play();
          update();

          var timer = setTimeout( function () {
            playerAttack(player2);
  
            /* playerAttack関数内で条件分岐してenemyAttackへの移行フラグを立てているため、削除
            var timer = setTimeout( function () {
              enemyAttack();
            } , 1300 );
            */
  
          } , 500 );
  
        } , 500 );

      }

      break;

    case 4: // にげる
      isKeyBlock=true;
      cursor.play();
      flee.play();
      document.getElementById("message").innerHTML = '<span class="message">'+player1.name+' は まわりこまれてしまった！</span>';
      var timer = setTimeout( function () {
        enemyAttack();
      } , 1300 );
      menu_init();
      break;

    default:
      break;
  }
}

//メニュー画面用のdoCommand
function doCommandMenu(command_id) { // doComand=関数名 command_id=第一引数
  if( isKeyBlock ) return; //自動進行中などでキー入力無効

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。

    case 1: //メニューの１番めのコマンド
    battle_init(enemy1);
    update();
    console.log("メニュー１番め押下");
    break;

    case 2: //メニューの2番めのコマンド
    battle_init(enemy2);
    update();
    console.log("メニュー２番め押下");
    break;

    case 3: //メニューの3番めのコマンド
    console.log("メニュー３番め押下");
    break;
  }
}

//攻撃するプレイヤーobjectを引数で受け取り、そのplayerの攻撃処理を行う
// function playerAttack(playerName) {
function playerAttack(player) {

  isKeyBlock=true;
  //以下のように、同SEを再生中にさらに再生しようとして失敗するのを防ぐには、pause+再生時間リセット > play()とする必要がある。
  attack.pause();
  attack.currentTime = 0;
  attack.play();
  console.log("se attack再生");
  var enemy_div = document.getElementById("enemy_div");
  var shadow = document.getElementById('shadow');
  var enemy_death = document.getElementById('enemy_div');

  // if (player == p1name) {
  //   var damage = p1atc;
  //   once_guard = 0; //once_guardはターン開始時（現状は攻撃時で処理）に解除
  //   console.log("キャラAの攻撃ターン");
  // } else {
  //   var damage = p2atc;
  //   console.log("キャラBの攻撃ターン");
  // }

  player.once_guard = 0; //once_guardはターン開始時（現状は攻撃時で処理）に解除
  console.log("キャラ"+player.name+"の攻撃ターン");

  // var rand_value = Math.floor(Math.random() * 100); // ０〜１０のランダム
  // damage += rand_value;
  // enemyHP = enemyHP - damage;
  // document.getElementById("message").innerHTML = '<span class="message">'+playerName+' の こうげき！<br>爵銀龍メルゼナ に '+damage+' のダメージ！</span>';

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
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 3");
      enemy.hp = 0;
      update();
      dq4_btl_fc.pause();
      Malzeno_Battle_Theme.pause();
      win.play();
      enemy_death.style.display = 'none';
      shadow.classList.remove("shadow");
      document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' を たおした！</span>';
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

    } , 400 ); //再生中にさらに再生しようとしたら失敗するのではないか？と考えここの時間を長くしてみると、attack.play()が２回目も正常に再生された。wavファイルの再生中にさらに同ファイルを再生しようとすると失敗するようだ。

  } , 900 );

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 4");

  console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 6");
}

function enemyAttack() {

  var friend_div = document.getElementById("friend-div");
  var freezing_waves = document.getElementById('effect');
  var nandNo = Math.floor(Math.random() * 10) //０か１のランダム

  if( nandNo <= 6 ){
    enemy_attack.play();
    var damage = enemy.atc;
    var rand_value = Math.floor(Math.random() * 100); // ０〜１０のランダム
    damage += rand_value;
    damage -= player1.def;
    damage -= player1.once_guard;
    if( damage < 0 ) {
      damage = 0; //防御強すぎてダメージがマイナスにならないよう０でリミットつける
    }
    player1.hp -= damage;
    
    document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' の こうげき<br>'+player1.name+' に '+damage+' のダメージ！</span>';

    var timer = setTimeout( function () {
      being_attacked.play();
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
          dq4_btl_fc.pause();
          Malzeno_Battle_Theme.pause();
          gameover.play();
          document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' に '+player1.name+' は たおされてしまった！</span>';
          return;
        }
  
        isKeyBlock = false;
  
      } , 400 );
  
    } , 500 );

  }else{

    var timer = setTimeout( function () {

      if ( enemy == enemy1) {
        freezing_waves_m.play();
      } else {
        Melzeno_roar.play();
      }

      freezing_waves.classList.add("effect_freezing_waves");
      document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' は '+enemy.skill+' を はなった！<br>しかし なにも おこらなかった！</span>';  

      var timer = setTimeout( function () {
        freezing_waves.classList.remove("effect_freezing_waves");
        isKeyBlock = false;
      } , 4000 );

    } , 400 );
  }

  /*
  var timer = setTimeout( function () {
    being_attacked.play();
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
        dq4_btl_fc.pause();
        Malzeno_Battle_Theme.pause();
        gameover.play();
        document.getElementById("message").innerHTML = '<span class="message">爵銀龍メルゼナ に キャラA は たおされてしまった！</span>';
        return;
      }

      var timer = setTimeout( function () {
        Melzeno_roar.play();
        // freezing_waves_m.play();
        freezing_waves.classList.add("effect_freezing_waves");
        document.getElementById("message").innerHTML = '<span class="message">爵銀龍メルゼナ は 咆哮 を はなった！<br>しかし なにも おこらなかった！</span>';  

        var timer = setTimeout( function () {
          freezing_waves.classList.remove("effect_freezing_waves");
          isKeyBlock = false;
        } , 4000 );

      } , 400 );

    } , 400 );

  } , 500 );
  */

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

}

//バトル初期化関数。encountEnemyを受け取って、対戦中のenemyにセットしてからバトル開始する。
function battle_init( encountEnemy ) {
  screenMode = screenModeBattle;

  enemy = encountEnemy;

  // document.getElementById("menu_container").setAttribute('style', 'display:block;'); //メニュー画面を表示
  document.getElementById("menu_container").setAttribute('style', 'display:none;'); //メニュー画面を非表示

  document.getElementById("battle_container").setAttribute('style', 'display:block;'); //バトル画面を表示
  // document.getElementById("battle_container").setAttribute('style', 'display:none;'); //バトル画面を非表示

  // if (enemy.type == "nomal") {
  //   dq4_btl_fc.play();
  // } else {
  //   Malzeno_Battle_Theme.play();
  // }

  document.getElementById("message").innerHTML = '<span class="message">'+enemy.name+' が あらわれた！</span>';

    if (enemy == enemy1) {
      var elem_div = document.getElementById("enemy_div");
        elem_div.classList.add("enemy-image");

      var elem_image = document.getElementById("elem_image");
        elem_image.src = enemy.imagepath;
        elem_image.classList.add("enemy-image-size");

      var battle_field = document.getElementById("battle_field");
        battle_field.classList.add("battle_field");

    } else {

      var elem_div = document.getElementById("enemy_div");
        elem_div.classList.remove("enemy-image");

      var elem_image = document.getElementById("elem_image");
        elem_image.src = enemy.imagepath;
        elem_image.classList.add("enemy-image2-size");    

      var battle_field = document.getElementById("battle_field");
        battle_field.classList.add("battle_field2");

    }


      //   elem_div.classList.add("enemy-image");

        // } else {
      // var elem_div = document.getElementById("enemy_div");
      //   elem_div.classList.remove("enemy-image");
    // }
    

    // elem.classList.add("enemy-image");
    // elem.classList.remove("enemy-image2");
    // update();
    // } else {
      // var elem = document.getElementById("enemy_image");
        // elem.src = enemy.imagepath;
        // elem.classList.add("enemy-image2");
        // elem.classList.remove("enemy-image");
      // update();
    // }

}

function menu_init() {
  screenMode = screenModeMenu;
  document.getElementById("menu_container").setAttribute('style', 'display:block;'); //メニュー画面を表示
  // document.getElementById("menu_container").setAttribute('style', 'display:none;'); //メニュー画面を非表示

  // document.getElementById("battle_container").setAttribute('style', 'display:block;'); //バトル画面を表示
  document.getElementById("battle_container").setAttribute('style', 'display:none;'); //バトル画面を非表示
}