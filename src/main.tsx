import '@fontsource-variable/baloo-2'
import '@fontsource-variable/nunito'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './app/router'
import { initAudio } from './audio'
import './index.css'

initAudio()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
