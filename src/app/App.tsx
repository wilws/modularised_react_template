import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MantineProvider } from "./components/Basic";
import { LangProvider } from "./providers/lang";
import router from "./router";

import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

/**
 * App root: providers wrap the router, so every module route has access to
 * the UI theme, language and toasts without importing them from the shell.
 */
const App = () => (
  <MantineProvider defaultColorScheme="auto">
    <div className="App">
      <LangProvider>
        <RouterProvider router={router} />
        <ToastContainer position="bottom-right" newestOnTop />
      </LangProvider>
    </div>
  </MantineProvider>
);

export default App;
