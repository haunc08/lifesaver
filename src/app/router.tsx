import { createBrowserRouter, Navigate } from 'react-router'
import { AreaScreen } from '@/screens/AreaScreen'
import { BootScreen } from '@/screens/BootScreen'
import { CharacterScreen } from '@/screens/CharacterScreen'
import { LessonScreen } from '@/screens/LessonScreen'
import { LevelScreen } from '@/screens/level/LevelScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { LobbyScreen } from '@/screens/LobbyScreen'
import { MapScreen } from '@/screens/MapScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { TownIntroScreen } from '@/screens/TownIntroScreen'
import { AppShell, RequireProfile } from './AppShell'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <BootScreen /> },
      { path: '/intro', element: <TownIntroScreen /> },
      { path: '/character', element: <CharacterScreen /> },
      {
        element: <RequireProfile />,
        children: [
          { path: '/lobby', element: <LobbyScreen /> },
          { path: '/map', element: <MapScreen /> },
          { path: '/area/:areaId', element: <AreaScreen /> },
          { path: '/level/:levelId', element: <LevelScreen /> },
          { path: '/library', element: <LibraryScreen /> },
          { path: '/library/:lessonId', element: <LessonScreen /> },
          { path: '/settings', element: <SettingsScreen /> },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
