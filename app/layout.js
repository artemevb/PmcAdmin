import './_styles/globals.css';



export default async function LocaleLayout({ children }) {

  return (
    <html lang="ru">
      <body>
          <main>{children}</main>
      </body>
    </html>
  );
}
