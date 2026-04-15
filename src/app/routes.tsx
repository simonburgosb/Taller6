import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Cabina from "./components/Cabina";
import MaxiLibro from "./components/MaxiLibro";
import StoryDetail from "./components/StoryDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Cabina },
      { path: "maxilibro", Component: MaxiLibro },
      { path: "historia/:id", Component: StoryDetail },
    ],
  },
]);
