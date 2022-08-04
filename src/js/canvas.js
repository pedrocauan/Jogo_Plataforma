import platform from "../img/platform.png"
import hills from "../img/hills.png"
import background from "../img/background.png"
import platformSmallTall from "../img/platformSmallTall.png"

import spriteRunLeft from "../img/spriteRunLeft.png"
import spriteRunRight from "../img/spriteRunRight.png"
import spriteStandLeft from "../img/spriteStandLeft.png"
import spriteStandRight from "../img/spriteStandRight.png"

const createImage = function (imgSrc) {
  const image = new Image()
  image.src = imgSrc
  return image
}




console.log(platform)

const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")
canvas.width = 1024 //Pega largura da tela
canvas.height = 576 // Pega altura da tela
const gravity = 0.5

class Platform {
  constructor({ x, y, image }) {
    //posição do cenário
    this.position = {
      x,
      y

    }
    this.image = image
    this.width = image.width,
      this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }

}


class GenericObject {
  constructor({ x, y, image }) {
    //posição do cenário
    this.position = {
      x,
      y,

    }
    this.image = image
    this.width = image.width,
      this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }

}


class Player {
  constructor() {
    //velocidade do player
    this.speed = 10
    //Posição do player
    this.position = {
      x: 100,
      y: 100
    }
    //velocidade do player
    this.velocity = {
      x: 0,
      y: 1
    }
    //Altura e largura do player
    this.width = 66
    this.height = 150

    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight)
      },

      run: {
        right:createImage(spriteRunRight) 
      }
   }

    this.currentSprite = this.sprites.stand.right
  }
  //desenha o player
  draw() {
    c.drawImage(
      this.currentSprite,
      //177 é a largura de cada frame
      177 * this.frames, /*posiçaõ no cartesiano x do sprite*/
      0, /*posiçaõ no cartesiano y do sprite*/
      177, /*largura */
      400, /*altura */
      this.position.x,
      this.position.y,
      this.width,
      this.height)
  }

  update() {
    this.frames++
    //28 é a quantidades de frames que a animação do boneco tem
    if(this.frames >  28)
      this.frames = 0
    this.draw()
    //gravidade
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    //Impede o player de sair da tela
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity

  }
}

const keys = {
  right: {
    pressed: false
  },

  left: {
    pressed: false
  }
}

const player = new Player()


let platformImage = createImage(platform)
  let platforms = [] 

  //montanhas, fundos, etc
  let genericObjects = []
  //ve se a tecla ta pressionada


  let scrollOffset = 0 // rolagem do cenario

function init() {
 platformImage = createImage(platform)
   platforms = [
    new Platform({
      x: platformImage.width * 4 + 300 - 2 + platformImage.width , y: 270, image: createImage(platformSmallTall)
    }),
    new Platform({
      x: -1,
      y: 475,
      image: platformImage
    }),
    new Platform({
      x: platformImage.width - 3, y: 475, image: platformImage
    }),
    new Platform({
      x: platformImage.width * 2 + 100, y: 475, image: platformImage
    }),
    new Platform({
      x: platformImage.width * 3 + 300, y: 475, image: platformImage
    }),
    new Platform({
      x: platformImage.width * 4 + 300 - 2, y: 475, image: platformImage
    }),
    new Platform({
      x: platformImage.width * 5 + 700 - 2, y: 475, image: platformImage
    })

    
  ]

  

  //montanhas, fundos, etc
  genericObjects = [
    //fundo
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background)
    }),
    //as montanha
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills)
    })
  ]
  //ve se a tecla ta pressionada


   scrollOffset = 0
}/*init*/
//Faz a animação do player ficar rodando infinitamente
init()
function animate() {
  requestAnimationFrame(animate)
  //faz o boneco andar
  c.fillStyle = "white"
  c.fillRect(0, 0, canvas.width, canvas.height)

  //coloca o background na tela
  genericObjects.forEach(genericObject => {
    genericObject.draw()
  })

  player.update() /*coloca o player na tela*/
  //desenha as plataforma
  platforms.forEach(platform => {
    platform.draw()
  })


  //movimento do personagem 
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0) ) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0

    //faz a tela andar quando o player anda pra direita
    if (keys.right.pressed) {
      scrollOffset += player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      //faz as montanha andar
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * .66 
      })
      //faz a tela andar quando o player anda pra esquerda
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed

      })
      //faz as montanha andar
      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed *.66
      })
    }
    //quando ele chega nessa posição ele ganha o jogo
    if (scrollOffset > platformImage.width * 5 + 300 - 2){
        console.log("Voce ganhou")
    }

    //se ele cair no buraco, ele morre
    if (player.position.y > canvas.height) {
        player.position.y = 100
        init()
    }
  }

  //faz o player ficar em cima da plataforma quando tiver em cima e cair quando sair dela
  platforms.forEach(platform => {
    if (player.position.y + player.height <= platform.position.y
      && player.position.y + player.height + player.velocity.y >= platform.position.y
      && player.position.x + player.width >= platform.position.x
      && player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0
    }
  })
}
animate()

//Controles
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    //tecla A - Esquerda
    case 65:
      console.log("left")
      keys.left.pressed = true
      break

    //tecla S - baixo
    case 83:
      console.log("down")
      //(positivo [+]) Faz o player ir pra 

      break

    //tecla D - direita
    case 68:
      console.log("right")
      keys.right.pressed = true
      player.currentSprite = player.sprites.run.right
      break

    //tecla w - cima
    case 87:
      console.log("top")
      //faz o player pular
      player.velocity.y -= 18 /*negativo [-] vai pra cima*/
      break
  }
})

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    //tecla A - Esquerda
    case 65:
      console.log("left")
      keys.left.pressed = false
      break

    //tecla S - baixo
    case 83:
      console.log("down")
      //(positivo [+]) Faz o player ir pra 

      break

    //tecla D - direita
    case 68:
      console.log("right")
      keys.right.pressed = false
      break

    //tecla w - cima
    case 87:
      console.log("top")
      //faz o player pular
      break
  }

})



