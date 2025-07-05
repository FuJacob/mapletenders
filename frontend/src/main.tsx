import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // Importing Tailwind CSS
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store"; // Assuming you have a Redux store setup
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
