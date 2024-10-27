import APITester from "./APITester";
import { ThemeProvider } from "./contexts/ThemeContext";
function App() {
  return (
    <ThemeProvider>
      <APITester />
    </ThemeProvider>
  );
}

export default App;
