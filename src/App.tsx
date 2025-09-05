import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./screens/home";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
