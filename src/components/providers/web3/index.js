import { createContext, useContext, useEffect, useMemo, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";
import { loadContract } from "../../../utils/loadContract";

// Creating the context
const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  // Initial state of web3Api
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks(), //bringing in hooks like setupNetwork and useAccount
  });

  useEffect(() => {
    // // Get the eth provider (Web3)

    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);
        // Getting the instance of the contract from loadContract in utils
        const contract = await loadContract("Lottery", web3);

        setWeb3Api({
          provider,
          web3,
          contract,
          isLoading: false,
          hooks: setupHooks(web3, provider), //Calleing the hooks with the required dependencies
        });
      } else {
        setWeb3Api((api) => ({ ...api, isLoading: false }));
        console.error("Please, install Metamask.");
      }
    };

    loadProvider();
  }, []);

  // Use the web3Api to creaate a copy to work with
  const _web3Api = useMemo(() => {
    const { provider, web3, isLoading } = web3Api;

    // The context will contain the _web3Api data below:  provider,web3,contract,isLoading
    // + isWeb3Loaded(bool depending is web3 has loaded or not)
    // + getHooks which runs setUpHooks
    // connect (returns your account)
    return {
      ...web3Api, // spread in existing web3Api
      requireInstall: !isLoading && !web3, // If these are false then must not have metamask
      connect: provider
        ? async () => {
            try {
              await provider.request({ method: "eth_requestAccounts" });
            } catch {
              window.location.reload();
            }
          }
        : () =>
            console.error(
              "Cannot connect to Metamask, try to reload your browser please."
            ),
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(cb) {
  const { hooks } = useWeb3();
  return cb(hooks);
}
