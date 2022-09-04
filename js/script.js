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

// 敵のステータス定義
var enemyHP = 12;
var enemyMP = 20;


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
  // dq4_btl_fc.play();
  document.getElementById("game_control").value = "コマンド番号:" + command_id; // game_controlというdocumentオブジェクト 各switch文内のcommand_idと連動してブラウザ上で操作できる

  switch(command_id) { // command_idという条件値を定義する。case=処理。分岐する数だけcaseを追加する。
    case 1: // たたかう
      cursor.play();
      attack.play();
      var enemy_div = document.getElementById("enemy_div");
      var damage = 3;
      var rand_value = Math.floor(Math.random() * 11); // ０〜１０のランダム
      damage += rand_value;
      enemyHP = enemyHP - damage;
      document.getElementById("message").innerHTML = '<span class="message">キャラA の こうげき！<br>スライム に '+damage+' のダメージ！</span>';

      var timer = setTimeout( function () {
        update();
        enemy_div.classList.add("enemy_receive_damage");
      } , 900 );
      var timer = setTimeout( function () {
        enemy_div.classList.remove("enemy_receive_damage");
      } , 1300 );

      isEnemyTurn = true;
      break;
    case 2: // ぼうぎょ
      cursor.play();
      document.getElementById("message").innerHTML = '<span class="message">キャラA は みをまもっている！</span>';
      break;
    case 3: // どうぐ
      cursor.play();
      document.getElementById("message").innerHTML = '<span class="message">キャラA は なにもアイテムをもっていなかった。</span>';
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
  document.getElementById("message").innerHTML = '<span class="message">スライム の こうげき<br>キャラA に 7 のダメージ！</span>';
  enemy_attack.play();
  var friend_div = document.getElementById("friend-div");
  var timer = setTimeout( function () {
    being_attacked.play();
    p1hp = p1hp - 7;
    update();
    friend_div.classList.add("shake");
  } , 700 );
  var timer = setTimeout( function () {
    friend_div.classList.remove("shake");
  } , 1300 );
  isEnemyTurn = false; //敵ターン終了
}

function update(){
  document.getElementById("p1hp").innerHTML = 'HP:' + p1hp;
  document.getElementById("enemyHP").innerHTML = 'HP:' + enemyHP;
}

// HP表示
function drawStatus(x = 0) {
  // 残HPで色を変える
  var color = "rgb(255,255,255)";
  if (player.hp == 0) {
    color = "rgb(255,32,32)";
  } else if (player.hp < player.maxhp / 2) {
    color = "rgb(255,180,32)";
  }
  drawWindow(10 + x, 10, 128, 64, 10, color);
  drawString("HP: " + player.hp, 30 + x, 50, color);
}

// イベントメッセージ描画
function drawMessage(message) {
  var WindowMargin = 10;
  var WindowWidth = canvas.width - WindowMargin * 2;
  var WindowHeight = canvas.height / 4;
  drawWindow(WindowMargin, canvas.height - WindowHeight - WindowMargin, WindowWidth, WindowHeight, WindowMargin);
  for (var i = 0; i < message.length; i++) {
    drawString(message[i], WindowMargin * 3, canvas.height - WindowHeight + WindowMargin + 24 * (i + 1));
  }
}

// メッセージウィンドウ描画
function drawWindow(x, y, WindowWidth, WindowHeight, WindowMargin = 10, frameColor = "rgb(255,255,255)") {
  g.fillStyle = frameColor;
  g.fillRect(x, y, WindowWidth, WindowHeight);
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(x + WindowMargin, y + WindowMargin, WindowWidth - WindowMargin * 2, WindowHeight - WindowMargin * 2);
}

// 文字列描画
function drawString(string, x, y, color = "rgb(255,255,255)") {
  g.font = "bold 16pt Arial";
  g.fillStyle = color;
  g.fillText(string, x, y);
}