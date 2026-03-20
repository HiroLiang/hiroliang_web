import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/layouts/app-layout'
import { HomePage } from '@/pages/home-page'
import { ProjectPage } from '@/pages/project-page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  )
}
