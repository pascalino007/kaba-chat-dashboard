import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MobileMenuProvider } from "../contexts/MobileMenuContext";
import { ChatModeProvider } from "../contexts/ChatModeContext"; // 👈 importer ici
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import client from "../lib/apolloClient";

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <MobileMenuProvider>
       
      <ChatModeProvider>
        <ApolloProvider client={client}>
        <Component {...pageProps} />
         </ApolloProvider>
      </ChatModeProvider>
     
    </MobileMenuProvider>
  );
}

export default MyApp;
