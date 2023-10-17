import Game from "./Game";

const startGame = (controlsType: string) => {
  document.getElementsByClassName('buttons_container')[0].remove()
  const game = new Game(controlsType);
  game.loop()
}

document.getElementById('button_pc')?.addEventListener('click', () => {
  startGame('pc')
})
document.getElementById('button_mobile')?.addEventListener('click', () => {
  startGame('mobile')
})

