import React from 'react'
import { useRoutes, Link } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import Events from './pages/Events'
import Admin from './pages/Admin'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <Locations />
    },
    {
      path: '/locations/:id',
      element: <LocationEvents />
    },
    {
      path: '/events',
      element: <Events />
    },
    {
      path: '/admin',
      element: <Admin />
    }
  ])

  return (
    <div className='app'>
      <main>
        {element}
      </main>
    </div>
  )
}

export default App