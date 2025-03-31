// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import favicon from "@/public/favicon.svg";
// import "./globals.css";

// export default function RootLayout({ children }) {
//   console.log(favicon);

//   return (
//     <html lang="en" className="h-full">
//       <link rel="icon" href={favicon} type="image/svg+xml" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />

//       <body className="flex min-h-full flex-col">
//         <Navbar />
//         <main className="flex-grow">{children}</main>
//         <Footer />
//       </body>
//     </html>
//   );
// }

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="relative grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
