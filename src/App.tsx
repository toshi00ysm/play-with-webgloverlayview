// import libraries
import React from 'react'
import { Reset } from 'styled-reset'

// import PJ resources
import Home from '@/components/pages/Home'

interface Props {}

const App: React.FunctionComponent<Props> = (props) => {
  return (
    <>
      <Reset />
      <Home />
    </>
  )
}

export default App
export {
  App,
  Props
}
