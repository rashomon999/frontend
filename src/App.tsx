import AppRouter from "./routes/AppRouter";
import { NotificationToast } from "./components/NotificationToast";

function App() {
  return (
    <>
      <AppRouter />
      <NotificationToast />
    </>
  );
}

export default App;