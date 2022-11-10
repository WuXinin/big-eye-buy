import Layout from "./components/Layout";
import BuyPage from "./pages/BuyPage";
import Providers from './Providers';
import { Toaster } from "react-hot-toast";




// import { Mainnet, DAppProvider } from "@usedapp/core";
// import { getDefaultProvider } from "ethers";

// const config = {
//   readOnlyChainId: Mainnet.chainId,
//   readOnlyUrls: {
//     [Mainnet.chainId]: getDefaultProvider("mainnet"),
//     56: "https://bsc-dataseed1.binance.org"
//   },
// };

const App = () => {
  return (
    <Providers>
      <Layout>
        {/* <DAppProvider config={config}> */}
        <BuyPage />
        <Toaster />
        {/* </DAppProvider> */}
      </Layout>
    </Providers>
  );
};

export default App;
