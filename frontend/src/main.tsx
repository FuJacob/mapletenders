import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // Importing Tailwind CSS
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "./app/configureStore.ts"; // Updated import for both store and persistor
import { PersistGate } from "redux-persist/integration/react";
import LoadingSpinner from "./components/common/LoadingSpinner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
