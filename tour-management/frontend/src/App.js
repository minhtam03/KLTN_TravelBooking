import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout/Layout";

const theme = createTheme({
  typography: {
    fontFamily: 'Mulish, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  )

}

export default App;
