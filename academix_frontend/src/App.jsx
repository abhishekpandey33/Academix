import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Course from './pages/Course';
import Topic from './pages/Topic';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Course />} />
      <Route path="/topic/:topicId" element={<Topic />} />
    </Routes>
  );
}

export default App;
