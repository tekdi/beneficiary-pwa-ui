import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import { AuthProvider } from "./utils/context/checkToken";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
