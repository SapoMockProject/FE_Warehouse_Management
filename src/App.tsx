import "./App.css";
import { AuthenticationProvider } from "./contexts/AuthenticationProvider";
import { AppRouter } from "./routers/AppRouter";

function App() {
	return (
		<>
			<AuthenticationProvider>
				<AppRouter />
			</AuthenticationProvider>
		</>
	);
}

export default App;
