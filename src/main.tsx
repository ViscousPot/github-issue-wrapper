import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename='/github-issue-wrapper'>
      <Routes>
        <Route path="/" Component={App} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
