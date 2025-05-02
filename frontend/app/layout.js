import "./globals.css";
import { SessionWrapper } from "./providers/session";
import { SnackbarWrapper} from './providers/snackbar'

export const metadata = {
  title: "stories | phpiiper"
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>
      <SessionWrapper>
        <SnackbarWrapper>
            {children}
        </SnackbarWrapper>
      </SessionWrapper>
      </body>
      </html>
  );
}
