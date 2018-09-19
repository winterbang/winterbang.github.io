var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
// canvas.width = 414
// canvas.height = 700

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

const screenWidth  = Math.min(window.innerWidth, 450)
const screenHeight = Math.min(window.innerHeight, 800)
const Margin  = 10
const Padding = 10
const Width = (screenWidth-Padding*2-Margin*2) / 4
const PaddingTop = (screenHeight-Width*4)/2

canvas.width = screenWidth
canvas.height = screenHeight

// 块
class Chunk {
  constructor(num, index) {
    this.num = num
    this.width = Width

    this.stepX = Width
    this.stepY = Width
    // this.image = new Image()
    // this.image.src = src
    // this.home = [parseInt((num - 1) / 4), (num - 1) % 4]

    this.updateIndex(index)
  }

  drawToCanvas (ctx) {
    let {x, y, index, width} = this

    // ctx.fillStyle = '#cac0b4'
    // ctx.fillRect(x, y, Width, Width)
    // fillRoundRect(ctx , x, y, Width, Width, 10, "#ccc0b3")
    ctx.fillRoundRect(x, y, Width-Padding, Width-Padding, 10, "#ebe0cb")
    // strokeRoundRect(ctx , x, y, Width, Width, 10, 8, "#bbaba0")

    ctx.textBaseline = "middle"
    ctx.font = `${width-40}px serif`
    ctx.textAlign =  "center"
    ctx.fillStyle = '#756e64'
    ctx.fillText(this.num, this.x+(Width-Padding)/2, this.y+(Width-Padding)/2)
  }

  // 检查当前块是不是在它应该在的位置
  isAtHome () {
    let { num, index } = this
    let homeIndex = [parseInt((num - 1) / 4), (num - 1) % 4]
    return homeIndex.join() == index.join()
  }

  // 更新当前块的坐标
  updateIndex (index){
    this.index = index
    this.x = index[1] * Width + Padding*1.5 + Margin
    this.y = index[0] * Width + PaddingTop+Padding/2
  }
}

// 按钮
class Button {
  constructor(label, location=[0, 0], width, height, style={}) {
    this.label = label
    this.location = location
    this.width = width || screenWidth/3
    this.height = height || 45
    this.btnArea = {
      startX: location[0],
      startY: location[1],
      endX  : location[0]+this.width,
      endY  : location[1]+this.height
    }
  }

  render (ctx) {
    let { width, height, location } = this
    ctx.textBaseline = "middle"
    ctx.font = "28px serif"
    ctx.textAlign =  "center"
    ctx.fillStyle = 'white'
    ctx.fillRoundRect(location[0], location[1], width, height, 10, "#e29c66")
    ctx.fillText(this.label, location[0]+width/2, location[1]+height/2)
  }
}

// 音乐
class Music {
  constructor() {

    // this.bgmAudio = new Audio()
    // this.bgmAudio.loop = true
    // this.bgmAudio.src  = 'audio/bgm.mp3'

    this.shootAudio     = new Audio()
    this.shootAudio.src = '/games/assets/klotski/boom.mp3'

    this.boomAudio     = new Audio()
    // this.boomAudio.src = 'res/audios/boom.mp3'
    this.boomAudio.src = '/games/assets/klotski/move.mp3'

    this.victoryAudio      = new Audio()
    this.victoryAudio.loop = true
    this.victoryAudio.src  = '/games/assets/klotski/victory.mp3'

    this.playBgm()
  }

  playBgm() {
    // this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playCrash() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  playVictory() {
    this.victoryAudio.play()
  }
}

// 场景
class Scene {

  render(ctx, time) {

    ctx.fillStyle = '#fbf8f0'
    ctx.fillRect(0, 0, screenWidth, screenHeight)

    // 展示按钮，文字，时间等附加项
    ctx.fillStyle = '#766e66'
    ctx.font = "38px serif"
    ctx.textBaseline = "bottom"
    ctx.textAlign =  "center"
    ctx.fillText('华容道', screenWidth/2, PaddingTop-70)
    ctx.fillText(time, screenWidth/2, PaddingTop-20)
    // 画数字面板
    ctx.fillRoundRect(Margin, PaddingTop-10, screenWidth-Margin*2, Width*4+20, 10, "#bbaba0")

    // ctx.fillStyle = '#766e66'
    // ctx.fillRect(10, PaddingTop+Width, screenWidth-20, 10)

    for (let i=1; i <= 16; i++) {
      let index = [parseInt((i - 1) / 4), (i - 1) % 4]
      let x = index[1] * Width + Padding*1.5 + Margin
      let y = index[0] * Width + PaddingTop+Padding/2
      ctx.fillRoundRect(x, y, Width-Padding, Width-Padding, 10, "#cbc0b5")
    }

  }
}

// 完成游戏画面
class Vicory {

  constructor() {
    this.init()
  }

  init () {
    this.index = 0
    this.imageList = []
    for(let i=0; i< 21; i++) {
      var image = new Image
      image.src = `/games/assets/klotski/victory/${i}.png`
      this.imageList.push(image)
    }
    this.button = new Button('再来一局', [screenWidth/3, screenHeight*3/4], screenWidth/3)
  }

  play () {
    this.isPlaying = true
    this.__timer = setInterval(() => {
      this.index++
      if(this.index > 20) this.index = 0
    }, 150)
  }

  drawToCanvas (ctx) {
    let imgWidth = this.imageList[this.index].width
    let imgHeight = this.imageList[this.index].height
    let x = (screenWidth-imgWidth)/2
    let y = (screenHeight-imgHeight)/2
    ctx.drawImage(this.imageList[this.index], x, y)

    this.button.render(ctx)
  }

  stop() {
    this.isPlaying = false
    if ( this.__timer ) clearInterval(this[__.timer])
  }
}

// 数据状态队列
class DataBus {
  constructor() {
    this.reset()
  }

  reset() {
    this.frame      = 0
    this.timer      = null
    this.time       = '00:00'
    this.matrix     = [[], [], [], []]
    this.clearing   = [3, 3]
    this.animations = []
    this.gameStatus = 'READY' // 'STATED' 'SUCCESSED'
  }

  // 移动矩阵
  move (direction) {
    let clearing = this.clearing
    let targetXY = {
      UP:    [clearing[0]+1, clearing[1]],
      DOWN:  [clearing[0]-1, clearing[1]],
      LEFT:  [clearing[0], clearing[1]+1],
      RIGHT: [clearing[0], clearing[1]-1]
    }[direction]
    if(!(targetXY[0] > 3 || targetXY[0] < 0 || targetXY[1] > 3 || targetXY[1] < 0)) {
      let chunk = this.matrix[targetXY[0]][targetXY[1]]
      chunk.updateIndex(clearing)
      this.matrix[clearing[0]][clearing[1]] = chunk
      this.matrix[targetXY[0]][targetXY[1]] = null
      this.clearing = targetXY
      return true
    } else {
      return false
    }
  }

  disruptMatrix () {

  }

  // 游戏计时器
  timedCount (count=0) {
    count +=1
    this.timer = setTimeout(this.timedCount.bind(this, count), 1000)
    let min = parseInt(count/60) < 10 ? '0'+parseInt(count/60) : parseInt(count/60)
    let sec = count%60 < 10 ? '0' + count%60 : count%60
    this.time = `${min}:${sec}`
  }

  // 计时器清零
  resetTime () {
    clearTimeout(this.timer)
    this.time = '00:00'
  }
}

// 主函数
class Main {
  constructor() {
    this.restart()
    this.touchStart = []
    this.music  = new Music()
    this.generateMatrix
    this.btnReset = new Button('重组',[screenWidth/12, screenHeight-PaddingTop+40])
    this.btnStart = new Button('开始',[screenWidth*7/12, screenHeight-PaddingTop+40])
  }

  init() {

  }

  restart() {

    this.generateMatrix()

    canvas.addEventListener('mousedown', (e) => this.pointerdown(e))
    canvas.addEventListener('mouseup', (e) => this.pointerup(e))

    canvas.addEventListener('touchstart', (e) => this.pointerdown(e))
    canvas.addEventListener('touchend', (e) => this.pointerup(e))

    document.addEventListener('keydown', (e) => {
      if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        let direction
        switch (e.keyCode) {
          case 37:
            direction = 'LEFT'
            break;
          case 38:
            direction = 'UP'
            break;
          case 39:
            direction = 'RIGHT'
            break;
          case 40:
            direction = 'DOWN'
            break;
        }
        databus.move(direction)
      }
    }, false);

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )

  }

  pointerdown(e) {
    e.preventDefault()

    let x = e.layerX || e.changedTouches[0].clientX
    let y = e.layerY || e.changedTouches[0].clientY

    this.touchStart = [x, y]
    let btnStartArea = this.btnStart.btnArea
    let btnResetArea = this.btnReset.btnArea
    let btnVictoryArea = victory.button.btnArea
    if( x >= btnVictoryArea.startX
       && x <= btnVictoryArea.endX
       && y >= btnVictoryArea.startY
       && y <= btnVictoryArea.endY
       && databus.gameStatus == 'SUCCESSED'
      ) {
         databus.resetTime()
         databus.gameStatus = 'STARTED'
         this.generateMatrix()
    } else if ( x >= btnStartArea.startX
       && x <= btnStartArea.endX
       && y >= btnStartArea.startY
       && y <= btnStartArea.endY ) {
       databus.timedCount()
       databus.gameStatus = 'STARTED'
     } else if ( x >= btnResetArea.startX
        && x <= btnResetArea.endX
        && y >= btnResetArea.startY
        && y <= btnResetArea.endY ) {
        databus.resetTime()
        // databus.disruptMatrix()
        this.generateMatrix()
     }
  }

  pointerup(e) {
    e.preventDefault()

    let x = e.layerX || e.changedTouches[0].clientX
    let y = e.layerY || e.changedTouches[0].clientY
    if (this.touchStart[1] > PaddingTop && this.touchStart[1] < PaddingTop+Width*4 && databus.gameStatus == 'STARTED') {
      this.chunkMoveHandler(x, y)
    }
  }

  generateMatrix() {
    let indexSample = [...Array(MaxNum)].map((v,k) => k+1)
    let disorderArray = indexSample.sort(function(i) {
      return 0.5 - Math.random()
    })
    databus.reset()
    for (let i=1; i <= MaxNum; i++) {
      let matrixIndex = [parseInt((i - 1) / 4), (i - 1) % 4]
      // let num = indexSample.splice(rnd(0, indexSample.length), 1)[0]
      let num = disorderArray[i-1]
      // let chunk = new Chunk(num, matrixIndex, `res/images/${num > 9 ? num : '0'+num}.png`)
      let chunk = new Chunk(num, matrixIndex, `res/images/${'o'+num}.png`)
      databus.matrix[matrixIndex[0]][matrixIndex[1]] = chunk
    }
  }

  chunkMoveHandler (x, y) {
    let direction = this.moveDirection(this.touchStart, [x, y])
    if(databus.move(direction)) {
      this.music.playCrash()
    }
  }

  moveDirection (startXY, endXY) {
    let horizontal = endXY[0] - startXY[0]
    let vertical = endXY[1] - startXY[1]
    if(Math.abs(horizontal) > Math.abs(vertical)) {
      if(horizontal > 0) return 'RIGHT'
      return 'LEFT'
    } else {
      if(vertical > 0) return 'DOWN'
      return 'UP'
    }
  }

  monitorAchieve () {
    databus.matrix.every((row, i) => {
      let status
      row.every((chunk, j) => {
        if(chunk) {
          if(i == 3 && j == 2) {
            databus.gameStatus = 'SUCCESSED'
            return false
          } else {
            return status = chunk.isAtHome()
          }

        }
      })
      return status
    })
  }

  render () {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 画背景
    scene.render(ctx, databus.time)

    // 画数字块
    databus.matrix.forEach((row, idx) => {
      row.forEach((chunk, idx) => {
        if(chunk) chunk.drawToCanvas(ctx)
      })
    })

    if ( (databus.gameStatus == 'SUCCESSED') ) {
      if (!victory.isPlaying) victory.play()
      victory.drawToCanvas(ctx)
      this.music.playVictory()
    } else {
      this.btnReset.render(ctx)
      this.btnStart.render(ctx)
    }
  }

  loop () {
    this.monitorAchieve()
    this.render()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}

let databus = new DataBus()
let victory = new Vicory()
let scene = new Scene()
let MaxNum = 15

new Main

// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 10, 10);
