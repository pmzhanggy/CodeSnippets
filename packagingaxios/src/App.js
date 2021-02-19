import Home from './views/home';


sessionStorage.setItem('userId', 12138);
function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
