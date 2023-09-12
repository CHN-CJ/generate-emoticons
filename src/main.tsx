/* @refresh reload */
import { render } from 'solid-js/web'
import '@unocss/reset/eric-meyer.css'
import 'uno.css'

// import './index.css'
import './style.css'

import App from './App1'

const root = document.getElementById('root')

render(() => <App />, root!)
