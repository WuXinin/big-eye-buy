import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { setupNetwork } from '../../../util/wallet';

const NetworkModal = ({
  modalType,
  targetChain,
  handleClose,
}: any) => {
  const { connector, chainId } = useWeb3React();
  useEffect(() => {
    if(targetChain && connector){
      (async () => {
        try {
          const provider = await connector.getProvider();
          setupNetwork(provider, targetChain);
        } catch (err) { }
      })();
    }
  }, [targetChain, connector]);
  return (
    <div className={`wallet-modal waiting network`}>
      <div
        className={`backdrop`}
        onClick={() => {
          handleClose();
        }}
      />
      <div className="content">
        <div className="loader-container">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="hero">Warning</div>
        <div className="message-content">
          <img src="/img/logo-desktop-header.svg" alt="" />
          {modalType == "BNB" && Number(chainId) != 56 && (
            <p>
              Please connect to BSC Mainnet
              <br /> Wrong Chain Id.
            </p>
          )}

          {(modalType == "USDT" || modalType == "ETH") && Number(chainId) != 1 && (
            <p>
              Please connect to Ethereum Mainnet
              <br /> Wrong Chain Id.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkModal;
