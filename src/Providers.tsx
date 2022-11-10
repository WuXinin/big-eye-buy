import { ModalProvider, light, dark } from 'wallet-bigeye';
import { Web3ReactProvider } from '@web3-react/core'
import { ThemeProvider } from 'styled-components'
import { getLibrary } from './util/web3React'
import { ReactNode } from "react";
interface Props {
  children?: ReactNode
  // any props that come into the component
}
const MyModalProvider: any = ModalProvider;
const Providers = ({ children }:Props) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={light}  >
        <MyModalProvider>{children}</MyModalProvider>
      </ThemeProvider>
    </Web3ReactProvider >
  )
}


export default Providers
