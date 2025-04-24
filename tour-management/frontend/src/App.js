import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "./components/Layout/Layout";

const theme = createTheme({
  typography: {
    fontFamily: 'Mulish, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray', // màu viền mặc định
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray', // màu khi hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray', // màu khi focus
            boxShadow: 'none',
          },
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  )

}

export default App;
