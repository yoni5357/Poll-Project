import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SinglePollPage from './pages/SinglePollPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poll/:slug" element={<SinglePollPage />} />
      </Routes>
    </Router>
  )
}

export default App
