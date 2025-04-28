import "./globals.css";
import { SessionWrapper } from "./providers/session";

export const metadata = {
  title: "stories | phpiiper"
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>
      <SessionWrapper>
        {children}
      </SessionWrapper>
      </body>
      </html>
  );
}
