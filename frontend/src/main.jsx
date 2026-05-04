import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'maplibre-gl/dist/maplibre-gl.css'
import './styles/map.css'

createRoot(document.getElementById('root')).render(<App />)
