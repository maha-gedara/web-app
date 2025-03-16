import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-10">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform transform hover:scale-125">
          <img src={viteLogo} className="h-24 w-24 animate-spin" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform transform hover:scale-125">
          <img src={reactLogo} className="h-24 w-24 animate-bounce" alt="React logo" />
        </a>
      </div>
      <h1 className="text-6xl font-extrabold mt-8 text-black">Vite + React + Tailwind</h1>
      <div className="mt-12 p-8 bg-white shadow-xl rounded-xl text-center max-w-sm w-full">
        <button
          onClick={() => setCount(count + 1)}
          className="px-8 py-3 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-lg transform transition-all hover:scale-105"
        >
          Count is {count}
        </button>
        <p className="mt-6 text-gray-600 text-lg">
          Edit <code className="bg-gray-200 p-1 rounded text-sm font-medium">src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-gray-200 text-lg italic">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
