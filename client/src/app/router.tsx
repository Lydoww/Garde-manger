import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from '@/features/home/HomePage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
