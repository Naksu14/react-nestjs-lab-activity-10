import "./App.css";
import AppRouter from "./routers/appRouter";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div
        className="App"
        style={{
          backgroundColor: "var(--bg-main)",
          color: "var(--text-primary)",
        }}
      >
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;
