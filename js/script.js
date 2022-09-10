// ゲーム全体の定義
var menu_id = 0;  // 定義
var damageElement = document.getElementById("damage");
var isEnemyTurn = false; //敵のターンフラグ

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
var p1hp = 100;
var p1maxhp = 100;
var p1atc = 5;
var p1def = 3;
var p1spd = 4;

// 戦闘BGM
var dq4_btl_fc = new Audio('sound/dq4_btl_fc.mp3');
dq4_btl_fc.volume = 0.5;

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

// 敵のステータス定義
var enemyHP = 100;
var enemyMP = 20;
var enemyATC = 6;


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

  if (keyEvent.keyCode==13) { //13はキーボードのEnterキー

    if( isEnemyTurn ){
      //敵ターン時は敵の攻撃処理をスタート
      enemyAttack();
    }else{
      doCommand(menu_id);
    }
  }
};

// コマンド実行
function doCommand(command_id) { // doComand=関数名 command_id=第一引数
  if( isEnemyTurn ) return; //敵ターンだったらなにもせずdoCommand関数から抜ける（つまりプレイヤーのコマンド無効）
  dq4_btl_fc.play();
  document.getElementById("game_control").value = "コマンド番号:" + command_id; // game_controlというdocumentオブジェクト 各switch文内のcommand_idと連動してブラウザ上で操作できる

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。
    case 1: // たたかう
      cursor.play();
      attack.play();
      var enemy_div = document.getElementById("enemy_div");
      var damage = p1atc;
      var rand_value = Math.floor(Math.random() * 11); // ０〜１０のランダム
      damage += rand_value;
      enemyHP = enemyHP - damage;
      document.getElementById("message").innerHTML = '<span class="message">キャラA の こうげき！<br>スライム に '+damage+' のダメージ！</span>';

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 1");
      var timer = setTimeout( function () {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 2");
        update();
        enemy_div.classList.add("enemy_receive_damage");
        // 死亡チェック
        if (enemyHP <= 0) {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 3");
          dq4_btl_fc.pause();
          win.play();
          var enemy_death = document.getElementById('enemy_div');
          enemy_death.style.display = 'none';
          var shadow = document.getElementById('shadow');
          shadow.classList.remove("shadow");
          document.getElementById("message").innerHTML = '<span class="message">スライム を たおした！</span>';          
          return;
        }
      } , 900 );

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 4");

      var timer = setTimeout( function () {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 5");
        enemy_div.classList.remove("enemy_receive_damage");
        enemyAttack();
      } , 1300 );

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>> 6");
      isEnemyTurn = true;
      break;
    case 2: // ぼうぎょ
      cursor.play();
      document.getElementById("message").innerHTML = '<span class="message">キャラA は みをまもっている！</span>';
      isEnemyTurn = true;
      break;
    case 3: // どうぐ
      cursor.play();

      var timer = setTimeout( function () {
        heal.play();
        p1hp += 10;
        update();
      } , 700 );

      document.getElementById("message").innerHTML = '<span class="message">キャラA は もっていた やくそう をつかった！<br>HP が 10 かいふくした</span>';
      isEnemyTurn = true;
      break;
    case 4: // にげる
      cursor.play();
      flee.play();
      document.getElementById("message").innerHTML = '<span class="message">キャラA は まわりこまれてしまった！</span>';
      break;
    default:
      break;
  }
}

function enemyAttack(){
  enemy_attack.play();
  var friend_div = document.getElementById("friend-div");
  var damage = enemyATC;
  var rand_value = Math.floor(Math.random() * 11); // ０〜１０のランダム
  damage += rand_value;
  damage -= p1def
  p1hp -= damage;
  document.getElementById("message").innerHTML = '<span class="message">スライム の こうげき<br>キャラA に '+damage+' のダメージ！</span>';

  var timer = setTimeout( function () {
    being_attacked.play();
     update();
    friend_div.classList.add("shake");
  } , 700 );
  var timer = setTimeout( function () {
    friend_div.classList.remove("shake");
  } , 1300 );
  isEnemyTurn = false; //敵ターン終了
}

// 戦闘画面の見た目担当
function update() {
  document.getElementById("p1hp").innerHTML = 'HP:' + p1hp;
  document.getElementById("enemyHP").innerHTML = 'HP:' + enemyHP;

  // HP減少時の画面の色替え
  if( p1hp <= 0 ) {
    // 死亡時
    document.getElementById("friend-div").className = "battle_window_red";
  } else if ( p1hp <= p1maxhp / 2 ) {
    // ピンチ時
    document.getElementById("friend-div").className = "battle_window_yellow";
  } else {
    // 通常時
    document.getElementById("friend-div").className = "battle_window";
  } 

}