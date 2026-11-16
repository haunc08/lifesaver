import { createBrowserRouter, Navigate } from 'react-router'
import { AreaScreen } from '@/screens/AreaScreen'
import { BootScreen } from '@/screens/BootScreen'
import { CharacterScreen } from '@/screens/CharacterScreen'
import { LessonScreen } from '@/screens/LessonScreen'
import { LevelScreen } from '@/screens/level/LevelScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { LobbyScreen } from '@/screens/LobbyScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { TownIntroScreen } from '@/screens/TownIntroScreen'
import { AppShell, RequireProfile } from './AppShell'

/** The site may be served from a sub-folder (GitHub Pages); routes are relative to it. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
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
  ],
  { basename },
)
