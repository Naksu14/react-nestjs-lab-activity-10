import "./App.css";
import AppRouter from "./routers/appRouter";

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
      }}
    >
      <AppRouter />
    </div>
  );
}

export default App;
