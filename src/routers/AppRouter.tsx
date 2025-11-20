import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DefaultLayout } from '../layouts/DefaultLayout'
import { Dashboard } from '../pages/Dashboard/Dashboard'

export const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<DefaultLayout/>}>
                <Route path='/dashboard' element={<Dashboard/>} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
