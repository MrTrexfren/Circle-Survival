const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
c.font = "30px arial"
var gameframe = 0
obstacle_size = 30
player_size = 40
time = 0

mouse = {
  x: null,
  y: null
}

class Player {
  constructor(x,y,radius,color,alive) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.alive = alive
  }
  draw() {
    if(this.alive) {
      c.fillStyle = this.color
      c.beginPath()
      c.arc(this.x,this.y,this.radius,0,Math.PI * 2)
      c.fill()
      c.closePath()
    }
  }
}

class Obstacle {
  constructor(x,y,radius,color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.distance
    this.diemode
  }
  draw() {
    c.fillStyle = this.color
    c.beginPath()
    c.arc(this.x,this.y,this.radius,0,Math.PI * 2)
    c.fill()
    c.closePath()
  }
  collide(obje) {
    var dx = this.x - obje.x
    var dy = this.y - obje.y
    this.distance = Math.sqrt(dx*dx + dy*dy)
  }
}

obstacles = []

const player = new Player(mouse.x,mouse.y,player_size,'blue',true)
player.draw()

addEventListener('mousemove',(event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

function handle_obstacles() {
  if(gameframe % 50 == 0) {
    var xpos = Math.random() * canvas.width
    var ypos = Math.random() * canvas.height
    obstacles.push(new Obstacle(xpos, ypos, obstacle_size, 'orange'))
  }

  for(let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw() 
    setTimeout(function(){
      if(player.alive) {
        obstacles[i].diemode = true
        obstacles[i].color = 'red'
        obstacles[i].collide(player)
      }
    }, 2000)
    if(obstacles[i].distance <= obstacles[i].radius + player.radius) {
      player.alive = false
      document.body.style.cursor = 'default'
      c.clearRect(0,0,canvas.width, canvas.height)
      obstacles.splice(0, obstacles.length)
      c.fillStyle = 'black'
      c.fillText('Final time survived: ' + time, 10, 50)
      c.fillText('Restarting...', 10,80)
      c.font = "100px arial"
      c.fillText('You died!', 600, 400)
      c.font = "30px georgia"
      setTimeout(function() {
        player.alive = true
        document.body.style.cursor = 'none'
        animate()
        time = 0
      }, 5000)
    }
  }
}




function animate() {
  if(player.alive) {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    if(gameframe % 50 == 0) {
      time++
      obstacle_size = Math.random() * 100
      player_size += 1
      if(obstacle_size < 10) {
        obstacle_size = 20
      }
    }
    c.fillStyle = 'black'
    c.fillText('Time Survived: ' + time, 10, 50)
    gameframe++
    handle_obstacles()
    player.radius = player_size
    player.x = mouse.x
    player.y = mouse.y
    player.draw()
  } 
}

animate()
