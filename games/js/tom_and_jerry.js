var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// canvas.width = 414
// canvas.height = 700
// var socket = io('http://127.0.0.1:1337');
// socket.on('connect', function(){
//   socket.send('hello');
// });
// socket.on('message', function(msg){
//   console.log(msg);
//   // socket.send('jerry moved');
// });
// socket.on('disconnect', function(){
//
// });

CanvasRenderingContext2D.prototype.drawRoundRectPath = function (width,height,radius) {
    this.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI
    this.arc(width-radius,height-radius,radius,0,Math.PI/2);

    //矩形下边线
    this.lineTo(radius,height);

    //左下角圆弧，弧度从1/2PI到PI
    this.arc(radius,height-radius,radius,Math.PI/2,Math.PI);

    //矩形左边线
    this.lineTo(0,radius);

    //左上角圆弧，弧度从PI到3/2PI
    this.arc(radius,radius,radius,Math.PI,Math.PI*3/2);

    //上边线
    this.lineTo(width-radius,0);

    //右上角圆弧
    this.arc(width-radius,radius,radius,Math.PI*3/2,Math.PI*2);

    //右边线
    this.lineTo(width,height-radius);
    this.closePath();
}

CanvasRenderingContext2D.prototype.fillRoundRect = function (x,y,width,height,radius,/*optional*/fillColor) {
  //圆的直径必然要小于矩形的宽高
  if(2*radius>width || 2*radius>height){return false;}

  this.save();
  this.translate(x,y);
  //绘制圆角矩形的各个边
  this.drawRoundRectPath(width,height,radius);
  this.fillStyle=fillColor||"#000";//若是给定了值就用给定的值否则给予默认值
  this.fill();
  this.restore();
}

CanvasRenderingContext2D.prototype.star5 = function (x, y, r1, r2, a=0) {
  this.beginPath();
  //设置是个顶点的坐标，根据顶点制定路径
  for (var i = 0; i < 5; i++) {
      this.lineTo(Math.cos((18+i*72-a)/180*Math.PI)*r1+x,
                      -Math.sin((18+i*72-a)/180*Math.PI)*r1+y);
      this.lineTo(Math.cos((54+i*72-a)/180*Math.PI)*r2+x,
                      -Math.sin((54+i*72-a)/180*Math.PI)*r2+y);
  }
  this.closePath();
  //设置边框样式以及填充颜色
  this.lineWidth="3";
  this.fillStyle = "#F6F152";
  this.strokeStyle = "#F5270B";
  this.fill();
  // cxt.stroke();
}

function index2ij(index, length=5) {
  return [parseInt((index) / length), (index) % length]
}

const screenWidth  = Math.min(window.innerWidth, 450)
const screenHeight = Math.min(window.innerHeight, 800)
const Margin  = 10
const Padding = 10
const Width = (screenWidth-Padding*2-Margin*2) / 4
const Height= Width
const PaddingTop = (screenHeight-Width*4)/2
const Top = (screenHeight-Width*4 + Padding*2)/2

canvas.width = screenWidth
canvas.height = screenHeight

class Chessman {
  constructor (x, y, r, color, style) {
    this.x = x
    this.y = y
    this.r = r || 20
    this.color = color
    this.styleFunc = style
    this.isPicked = false
  }

  render(ctx, ix=null, iy=null) {

    let { x, y, r, color } = this

    let drawX = ix || x
    let drawY = iy || y

    ctx.beginPath()
    ctx.arc(drawX, drawY, r, 0, 360, false)
    ctx.fillStyle = color || "white"
    ctx.fill()

    if (this.styleFunc) this.styleFunc(ctx, drawX, drawY)
  }

  /**
   * 根据手指的位置设置棋子的位置
   * 保证手指处于棋子中间
   * 同时限定棋子的活动范围限制在棋盘中
   */
  setAirPosAcrossFingerPosZ(x, y) {
    let { r } = this
    let disX = x - r
    let disY = y - r

    if ( disX < 0 )
      disX = r

    else if ( disX > screenWidth - r*2 )
      disX = screenWidth - r

    if ( disY <= 0 )
      disY = 0

    else if ( disY > screenHeight - r*2 )
      disY = screenHeight - r*2

    this.x = disX
    this.y = disY
  }

  updateXY(x, y) {
    this.x = x
    this.y = y
  }

  area() {
    let { x, y, r } = this
    return {
      startX: x - r,
      startY: y - r,
      endX: x + r,
      endY: y + r
    }
  }

}

class Chessboard {

  constructor(rowNum, columnNum, style={}) {
    this.rowNum = rowNum || 5
    this.columnNum = columnNum || 5
    this.margin  = style.margin || 10
    this.padding = style.padding || 10
    this.top     = style.top
    this.background = "#bbaba0"
    this.space      = 10
    this.setCrosses()
  }

  render (ctx) {
    let { margin, padding, rowNum, columnNum, background } = this
    let width = (screenWidth-padding*2-margin*2) /(rowNum-1)
    ctx.fillStyle = '#ddd5ca'
    ctx.fillRect(0, 0, screenWidth, screenHeight)

    // 展示按钮，文字，时间等附加项
    ctx.fillStyle = '#766e66'
    ctx.font = "38px serif"
    ctx.textBaseline = "bottom"
    // ctx.textAlign =  "center"
    // ctx.fillText('猫捉老鼠', screenWidth/2, PaddingTop-70)
    ctx.textAlign =  "left"
    ctx.fillText('猫捉老鼠', Margin+Padding, PaddingTop-70)
    // 画数字面板
    ctx.fillRoundRect(margin, PaddingTop-10, screenWidth-margin*2, Width*4+20, 10, background)

    for (let i=1; i <= (rowNum-1)*(columnNum-1); i++) {
      let index = [parseInt((i - 1) / 4), (i - 1) % 4]
      let x = index[1] * Width + padding*1.5 + margin
      let y = index[0] * Width + PaddingTop+padding/2
      ctx.fillRoundRect(x, y, Width-padding, Width-padding, 10, "#cbc0b5")
    }

  }

  // 设置每个交叉点的坐标
  setCrosses () {
    this.crosses = [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]]
    // this.crosses = [...Array(rowNum)].map((v,k) =>[null, null, null, null, null])
    let { rowNum, columnNum, padding, margin} = this
    for( let i=0; i < rowNum*columnNum; i++ ) {
      let ij = index2ij(i)
      // console.log(ij)
      // let i = parseInt((i - 1) / 5)
      // let j = (i - 1) % 5
      let x = ij[1] * Width + padding + margin
      let y = ij[0] * Width + PaddingTop
      this.crosses[ij[0]][ij[1]] = [x, y]
    }
  }


}

class Jerry extends Chessman {
  constructor(x, y, r, color) {
    let style = function (ctx, x, y) {
      // ctx.beginPath()
      // ctx.arc(x, y, 8, 0, 360, false)
      // ctx.fillStyle = "red"
      // ctx.fill()
      ctx.textBaseline = "middle"
      ctx.font = `${30}px serif`
      ctx.textAlign =  "center"
      ctx.fillStyle = '#756e64'
      ctx.fillText('🐭', x, y)
    }
    super(x, y, r, color, style)
  }


}

class Tom extends Chessman {
  constructor(x, y, r, color) {

    let style = function (ctx, x, y) {
      // star5(ctx, x, y, 15, 8)
      ctx.textBaseline = "middle"
      ctx.font = `${30}px serif`
      ctx.textAlign =  "center"
      ctx.fillStyle = '#756e64'
      ctx.fillText('🐱', x, y)
    }

    super(x, y, r, color, style)
  }

}

// 音乐
class Music {
  constructor() {

    this.catchAudio     = new Audio()
    this.catchAudio.src = '/games/assets/cat.wav'

    this.moveAudio     = new Audio()
    // this.boomAudio.src = 'res/audios/boom.mp3'
    this.moveAudio.src = '/games/assets/klotski/move.mp3'

    this.victoryAudio      = new Audio()
    this.victoryAudio.loop = true
    this.victoryAudio.src  = '/games/assets/klotski/victory.mp3'

    this.playBgm()
  }

  playBgm() {
    // this.bgmAudio.play()
  }

  playCatch() {
    this.catchAudio.currentTime = 0
    this.catchAudio.play()
  }

  playMove() {
    this.moveAudio.currentTime = 0
    this.moveAudio.play()
  }

  playVictory() {
    this.victoryAudio.play()
  }
}

class Databus {
  constructor() {
    // this.pool = new Pool()
    this.iam = 'Tom'
    this.reset()
    this.music = new Music()
  }

  reset() {
    this.pickedChessman = null // 当前选中的棋子
    this.pickedChessmanij = [] // 当前选中的索引
    this.chessboard = [[], [], [], [], []]  // 棋局
    this.catchedJerries = []
    this.myTurn = false
    this.roomNo = ''
  }

  // 更新棋盘的当前棋局
  updateChessboard(ij, ogij=null, who=null) {

    // 猫和老鼠看到的棋盘是相反的，如果当前棋子不是自己移动则要逆转一下坐标
    if(this.iam != who) {
      ij = [5-ij[0]-1, 5-ij[1]-1]
      ogij = ogij ? [5-ogij[0]-1, 5-ogij[1]-1] : ogij
    }

    let chessboard = new Chessboard
    let xy = chessboard.crosses[ij[0]][ij[1]] // 获取目标位置的坐标

    let orgij = ogij || this.pickedChessmanij
    let movingChessman = ogij ? this.chessboard[ogij[0]][ogij[1]] : this.pickedChessman
    movingChessman.updateXY(xy[0], xy[1])  // 更新所移动棋子的坐标到目标位置的坐标

    if(this.chessboard[ij[0]][ij[1]]) {
      this.catchedJerries.push(this.chessboard[ij[0]][ij[1]])
      this.music.playCatch()
    }  else {
      this.music.playMove()
    }
    this.chessboard[ij[0]][ij[1]] = movingChessman
    this.chessboard[orgij[0]][orgij[1]] = null
    this.pickedChessmanij = null
    this.pickedChessman = null
  }

  canMoved (ij) {
    // 如果是jerry并且目标位置有棋子
    let currIJ = this.pickedChessmanij
    let isJerry = (this.pickedChessman.constructor.name == 'Jerry')
    // 目标位置有棋子时
    // 1.如果当前移动的棋子时jerry则不可移动
    // 2.如果是tom且中间隔着一个空位置，且目标位置是个jerry
    if(this.chessboard[ij[0]][ij[1]]) {
      // 如果是jerry则不可移动
      if(isJerry) return false

      let average
      if(ij[0] == currIJ[0]) {
        average = (ij[1] + currIJ[1])/2
        return (average%1 === 0 && !this.chessboard[ij[0]][average] && this.chessboard[ij[0]][ij[1]].constructor == Jerry)
      } else if(ij[1] == currIJ[1]) {
        average = (ij[0] + currIJ[0])/2
        return (average%1 === 0 && !this.chessboard[average][ij[1]] && this.chessboard[ij[0]][ij[1]].constructor == Jerry)
      }
    }

    // 目标位置在当前选中棋子所在位置的上下左右,且该位置没有棋子
    let up = [currIJ[0]-1, currIJ[1]].join('')
    let down = [currIJ[0]+1, currIJ[1]].join('')
    let left = [currIJ[0], currIJ[1]-1].join('')
    let right = [currIJ[0], currIJ[1]+1].join('')
    return [up, down, left, right].indexOf(ij.join('')) > -1

  }

  removeJerry() {

  }

}

var config = { syncURL: "https://wd1764117481ebcsxn.wilddogio.com" }
wilddog.initializeApp(config);
var roomsRef = wilddog.sync().ref('rooms')

class Main {
  constructor () {
    this.chessboard = new Chessboard()
    this.chessboard.render(ctx)
    // this.render()
    // this.initChesses()
  }

  start () {
    this.initChesses ()
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let ij = this.xy2ij(x, y)
      let chessman = databus.chessboard[ij[0]][ij[1]]
      if(ij && chessman && chessman.constructor.name == databus.iam) {
        databus.pickedChessman = databus.chessboard[ij[0]][ij[1]]
        databus.pickedChessmanij = ij
      }
    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      if(databus.pickedChessman && databus.myTurn) {
        databus.pickedChessman.setAirPosAcrossFingerPosZ(x, y)
      }
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      let pickedChessman = databus.pickedChessman
      if (!pickedChessman) return
      let ij = this.xy2ij(pickedChessman.x, pickedChessman.y)

      if(ij && databus.canMoved(ij) && databus.myTurn) {
        // socket.emit('moved', {org: databus.pickedChessmanij, des: ij })
        databus.myTurn = !databus.myTurn
        room.roomRef.child('move').update({
          from: databus.pickedChessmanij,
          to: ij,
          iam: databus.iam
        })
      } else {
        // 回到初始位置
        let ij = databus.pickedChessmanij
        let xy = this.chessboard.crosses[ij[0]][ij[1]]
        databus.pickedChessman.updateXY(xy[0], xy[1])
      }
    }).bind(this))

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }


  initChesses () {
    this.chessboard.render(ctx)
    this.chessboard.crosses.slice(0, 3).forEach((crosses, i) => {
      crosses.forEach((cross, j) => {
        let jerry, ij= [i, j]
        if(databus.iam == 'Jerry') {
          ij = this.invertIJ(i, j)
          let xy = this.chessboard.crosses[ij[0]][ij[1]]
          jerry = new Jerry(xy[0], xy[1], 20, 'black')
        } else {
          jerry = new Jerry(cross[0], cross[1], 20, 'black')
        }
        // jerry.render(ctx)
        // let ij = index2ij(idx)
        databus.chessboard[ij[0]][ij[1]] = jerry
      })
    })

    this.chessboard.crosses.slice(4, 5).forEach((crosses, idx) => {
      // console.log(crosses);
      crosses.slice(1, 4).forEach((cross, index) => {
        let tom, ij=[4, crosses.indexOf(cross)]
        if(databus.iam == 'Jerry') {
          ij = this.invertIJ(ij[0], ij[1])
          let xy = this.chessboard.crosses[ij[0]][ij[1]]
          tom = new Tom(xy[0], xy[1], 30, 'white')
        } else {
          tom = new Tom(cross[0], cross[1], 30, 'white')
        }
        databus.chessboard[ij[0]][ij[1]] = tom
      })
    })
  }

  xy2ij (x, y) {
    let i = parseInt((y - Top + Height/2) / Height)
    let j = parseInt((x - Margin + Width/2) / Width)
    if (i < 0 || j < 0 || i > databus.chessboard.length-1) return null
    let chessboard = databus.chessboard

    let chessman = chessboard[i][j]
    if (!chessman) return [i,j]
    let area = chessman.area()

    if( x >= area.startX
         && x <= area.endX
         && y >= area.startY
         && y <= area.endY ) {
      // x, y 是某个棋子的坐标区域，则返回对应的棋子在棋盘中的索引
      return [i,j]
    } else {
      // x, y不是某个棋子的坐标，则返回null
      return null
    }
  }

  invertIJ (i, j, x=5, y=5) {
    return [x-i-1, y-j-1]
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // 画棋盘
    this.chessboard.render(ctx)

    // 当前玩家
    ctx.fillStyle = '#766e66'
    ctx.font = "24px serif"
    ctx.textBaseline = "bottom"
    ctx.textAlign =  "left"
    ctx.fillText('当前', screenWidth*2/3, PaddingTop-70)
    let tom = new Tom(screenWidth*2.6/3, PaddingTop-80, 20, 'white')
    let jerry = new Jerry(screenWidth*2.6/3, PaddingTop-80, 20, 'black')
    let currentPlayer = tom
    if(databus.myTurn) {
      currentPlayer = databus.iam == "Jerry" ? jerry : tom
    } else {
      currentPlayer = databus.iam == "Jerry" ? tom : jerry
    }
    currentPlayer.render(ctx)

    // 计分
    let jerryChessman = new Jerry(Margin+Padding+20, screenHeight-PaddingTop+Height, 20, 'black')
    jerryChessman.render(ctx)
    ctx.fillStyle = '#766e66'
    ctx.font = "32px serif"
    ctx.textBaseline = "middle"
    ctx.textAlign =  "left"
    ctx.fillText(` x ${databus.catchedJerries.length}`, Margin+Padding+20+20, screenHeight-PaddingTop+Height)



    databus.chessboard.forEach((row, i) => {
      row.forEach((chessman, j) => {
        if(chessman && chessman !=databus.pickedChessman) {
          chessman.render(ctx)
        }
      })
    })
    if(databus.pickedChessman) databus.pickedChessman.render(ctx)
  }

  loop () {
    // this.monitorAchieve()
    this.render()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}

class Room {
  constructor(no=null, game) {
    this.game = entryGame
    this.no = no
    this.roomRef = null
    this.status = null// creating, created, playing, entering, faild
    no ? this.joined() : this.create()
  }

  init () {
    let id = new Fingerprint().get();
    return {
      tom: id, jerry: "",
      move: {
        from: "",
        to: "",
        iam: ""
      },
      created_at: Date.parse( new Date())
    }
  }

  create() {
    this.status = 'creating'
    this.no = this._generateRoomNo()
    roomsRef.once('value').then( (snapshot) => {
      while (snapshot.child(this.no).exists()) {
        this.no = this._generateRoomNo()
      }
      this.roomRef = roomsRef.child(this.no)
      this.roomRef.set(this.init()).then(() => {
        this._initEven()
        this.status = 'created'
        $('.loading').trigger("changeText")
      }).catch(function(err){
        this.status = 'faild'
        console.info('update data failed', err.code, err);
      });
    })
  }

  joined() {
    databus.iam = 'Jerry'
    let id = new Fingerprint().get();
    this.roomRef = roomsRef.child(this.no)
    this._initEven()
    this.roomRef.child(`jerry`).set(id).then(() => {
      this.status = 'playing'
      $('.loading').trigger("hide")
      this.game.start()
    })
  }

  _generateRoomNo () {
    return Math.floor(Math.random() * (9999 - 1000) + 1000).toString().slice(1)
  }

  _initEven() {
    this.roomRef.on("child_changed", (snapshot, prev) => {
      let changedVal = snapshot.val()
      let changedKey = snapshot.key()
      switch (changedKey) {
        case 'move':
          if(changedVal.to && changedVal.from) {
            databus.updateChessboard(changedVal.to, changedVal.from, changedVal.iam)                   // 更新棋局
            databus.myTurn = !(changedVal.iam == databus.iam)
          }
          break;
        case 'jerry':
          if(databus.iam == 'Tom') databus.myTurn = true
          this.status = 'playing'
          $('.loading').trigger("hide")
          this.game.start()
          break;
        default:
      }
    });

  }
}

let databus = new Databus()
let entryGame = new Main

// let newroomBtn = document.getElementById('ck-newroom')
// let intoroomBtn = document.getElementById('ck-intoroom')

let room = {}
$('#ck-newroom').click(function () {
  room = new Room()
  $('.ready').hide()
  $('.loading').css("display","flex")
  $('.loading').on('hide', function () {
    $('.loading').hide()
  });
  $('.loading').on('changeText', function (text=null) {
    let tt = `快去引诱引诱老鼠进入【${room.no}】房间...`
    $('.loading-text').text(tt)
  });

})

$('#ck-intoroom').click(function () {
  let no = $("input[name='room-no']").val()
  if(no) {
    $('.ready').hide()
    $('.loading').css("display","flex")
    roomsRef.once('value').then( (snapshot) => {
      if (snapshot.child(no).exists()) {
        room = new Room(no)
        $('.loading').on('hide', function () {
          $('.loading').hide()
        });

        $('.loading').on('changeText', function (text=null) {
          let tt = `正在引诱老鼠进入【${room.no}】房间...`
          $('.loading-text').text(tt)
        });
      } else {
        $('.loading').hide()
        $('.ready').show()
        $('.bg-danger').text('亲，我拼命的找了一圈也没有找到这个房间呢...')
        $('.bg-danger').css('top', 0)
        setTimeout(() => {
          $('.bg-danger').text('')
          $('.bg-danger').css('top', -40)
        }, 3000 )
      }
    })

  } else {
    $('.bg-danger').text('亲，请告诉我房间号吧')
    $('.bg-danger').css('top', 0)
    setTimeout(() => {
      $('.bg-danger').text('')
      $('.bg-danger').css('top', -40)
    }, 3000 )
    console.log("don't input anything");
  }
})


// function rnd(start, end){
//   return Math.floor(Math.random() * (end - start) + start)
// }
// let roomNo = rnd(1000, 9999).toString().slice(1)

// socket.on('updateChessboard', (msg) => {
//   console.log(msg);
//   let { des, org } = msg
//   // {org: databus.pickedChessmanij, des: ij }
//   databus.updateChessboard(des, org)                   // 更新棋局
// })
