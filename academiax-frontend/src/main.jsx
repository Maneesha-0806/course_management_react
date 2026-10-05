import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";
import { EnrollmentProvider } from "./context/EnrollmentContext";
import { SubmissionProvider } from "./context/SubmissionContext";
import { NotificationProvider } from "./context/NotificationContext";
import theme from "./theme";

createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <EnrollmentProvider>
            <SubmissionProvider>
              {/* 2. Add the NotificationProvider here */}
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </SubmissionProvider>
          </EnrollmentProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </ChakraProvider>
);