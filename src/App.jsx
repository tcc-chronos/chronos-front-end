import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Documentation from './pages/documentation'
import Dashboard from './pages/dashboard'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path='/documentation' element={<Documentation />} />
    </Route>
  )
)

function App() {
  const [count, setCount] = useState(0)

  return <RouterProvider router={router} />
}

export default App
