import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./pages/Root.tsx";
import Trade from "./pages/Trade.tsx";
import History from "./pages/History.tsx";
import Settings from "./pages/Settings.tsx";
import { NextUIProvider } from "@nextui-org/react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "/trade",
				element: <Trade />,
			},
			{
				path: "/history",
				element: <History />,
			},
			{
				path: "/settings",
				element: <Settings />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<NextUIProvider>
		<main className="dark text-foreground bg-background">
			<RouterProvider router={router} />
		</main>
	</NextUIProvider>
	// </React.StrictMode>
);

// Remove Preload scripts loading
postMessage({ payload: "removeLoading" }, "*");

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
