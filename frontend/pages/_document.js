import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Orbitron:wght@400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ysabeau:ital,wght@0,1..1000;1,1..1000&display=swap');
          </style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
