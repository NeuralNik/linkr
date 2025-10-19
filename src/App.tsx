import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Batch from "./pages/Batch";
import Templates from "./pages/Templates";
import History from "./pages/History";
import Developer from "./pages/Developer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className='min-h-screen flex flex-col'>
            <Header />
            <div className='flex-1'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/batch' element={<Batch />} />
                <Route path='/templates' element={<Templates />} />
                <Route path='/history' element={<History />} />
                <Route path='/developer' element={<Developer />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path='*' element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
