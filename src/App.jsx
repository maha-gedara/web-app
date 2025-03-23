

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />

          //sanduni


          //jithma


          //lakshitha


          //primal
        </Routes>
      </div>
    </Router>
  );
}

export default App;
