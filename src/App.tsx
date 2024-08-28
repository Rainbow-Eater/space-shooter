import styled from '@emotion/styled'
import config from './game-config'
import Game from './game'

function App() {
  return (
    <GameContainer>
      <Game config={config} />
    </GameContainer>
  )
}

export default App

const GameContainer = styled.div`
  height: 100vh;
  width: 100wv;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/piiixl/bg.gif');
  background-color: rgba(0, 0, 0, 0.5);
  background-blend-mode: darken;
`
