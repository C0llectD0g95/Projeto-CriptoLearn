import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { BrowserProvider, formatEther } from "ethers";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface WalletContextType {
  walletAddress: string | null;
  balance: string | null;
  isConnecting: boolean;
  hasMetaMask: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  savedWallets: Array<{ id: string; wallet_address: string; wallet_type: string; is_primary: boolean }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [savedWallets, setSavedWallets] = useState<Array<{ id: string; wallet_address: string; wallet_type: string; is_primary: boolean }>>([]);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    setHasMetaMask(typeof window !== "undefined" && !!window.ethereum?.isMetaMask);
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedWallets();
    } else {
      setSavedWallets([]);
    }
  }, [user]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[];
        if (accountsArray.length === 0) {
          setWalletAddress(null);
          setBalance(null);
        } else {
          setWalletAddress(accountsArray[0]);
          fetchBalance(accountsArray[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const fetchSavedWallets = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setSavedWallets(data);
    }
  };

  const fetchBalance = async (address: string) => {
    if (!window.ethereum) return;
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      setBalance(formatEther(balanceWei));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask não encontrado",
        description: "Por favor, instale a extensão MetaMask no seu navegador.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];
      setWalletAddress(address);
      await fetchBalance(address);

      if (user) {
        const { error } = await supabase
          .from("wallets")
          .upsert({
            user_id: user.id,
            wallet_address: address,
            wallet_type: "metamask",
            is_primary: savedWallets.length === 0,
          }, {
            onConflict: "user_id,wallet_address"
          });

        if (error) {
          console.error("Error saving wallet:", error);
        } else {
          await fetchSavedWallets();
          toast({
            title: "Carteira conectada!",
            description: `${address.slice(0, 6)}...${address.slice(-4)} foi vinculada à sua conta.`,
          });
        }
      } else {
        toast({
          title: "Carteira conectada!",
          description: "Faça login para vincular a carteira à sua conta.",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível conectar a carteira. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    setWalletAddress(null);
    setBalance(null);
    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada do site.",
    });
  };

  return (
    <WalletContext.Provider value={{
      walletAddress,
      balance,
      isConnecting,
      hasMetaMask,
      connectWallet,
      disconnectWallet,
      savedWallets,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
