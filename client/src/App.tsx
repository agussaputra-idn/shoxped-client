import useRouteElements from './useRouteElements';
// (Import AuthContext.Provider sudah dihapus)

function App() {
  const routeElements = useRouteElements();

  // (AuthContext.Provider sudah dihapus dari sini)
  return <div>{routeElements}</div>;
}

export default App;