import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { useWallet } from "./useWallet";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESSES } from "@/contracts/config";
import TEATokenABI from "@/contracts/TEAToken.json";
import TEAStakingABI from "@/contracts/TEAStaking.json";

export const useStaking = () => {
  const { walletAddress, hasMetaMask } = useWallet();
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [earnedRewards, setEarnedRewards] = useState<string>("0");
  const [teaBalance, setTeaBalance] = useState<string>("0");
  const [totalStaked, setTotalStaked] = useState<string>("0");
  const [rewardRate, setRewardRate] = useState<string>("0");
  const [allowance, setAllowance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);

  const getProvider = useCallback(() => {
    if (!window.ethereum) return null;
    return new BrowserProvider(window.ethereum);
  }, []);

  const getTokenContract = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.TEA_TOKEN, TEATokenABI, signer);
  }, [getProvider]);

  const getStakingContract = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.TEA_STAKING, TEAStakingABI, signer);
  }, [getProvider]);

  const fetchStakingData = useCallback(async () => {
    if (!walletAddress) return;
    
    try {
      const provider = getProvider();
      if (!provider) return;

      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.TEA_TOKEN,
        TEATokenABI,
        provider
      );
      const stakingContract = new Contract(
        CONTRACT_ADDRESSES.TEA_STAKING,
        TEAStakingABI,
        provider
      );

      const [balance, staked, earned, total, rate, userAllowance] = await Promise.all([
        tokenContract.balanceOf(walletAddress),
        stakingContract.balanceOf(walletAddress),
        stakingContract.earned(walletAddress),
        stakingContract.totalSupply(),
        stakingContract.getRewardRatePerYear(),
        tokenContract.allowance(walletAddress, CONTRACT_ADDRESSES.TEA_STAKING),
      ]);

      setTeaBalance(formatEther(balance));
      setStakedBalance(formatEther(staked));
      setEarnedRewards(formatEther(earned));
      setTotalStaked(formatEther(total));
      setRewardRate(formatEther(rate));
      setAllowance(formatEther(userAllowance));
    } catch (error) {
      console.error("Error fetching staking data:", error);
    }
  }, [walletAddress, getProvider]);

  useEffect(() => {
    if (walletAddress) {
      fetchStakingData();
      // Refresh every 30 seconds
      const interval = setInterval(fetchStakingData, 30000);
      return () => clearInterval(interval);
    }
  }, [walletAddress, fetchStakingData]);

  const approve = useCallback(async (amount: string) => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para aprovar.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const tokenContract = await getTokenContract();
      if (!tokenContract) throw new Error("Failed to get contract");

      const amountWei = parseEther(amount);
      const tx = await tokenContract.approve(CONTRACT_ADDRESSES.TEA_STAKING, amountWei);
      
      toast({
        title: "Aprovação enviada",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Aprovação concluída!",
        description: "Agora você pode fazer stake dos seus TEA.",
      });

      await fetchStakingData();
      return true;
    } catch (error: any) {
      console.error("Error approving:", error);
      toast({
        title: "Erro ao aprovar",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getTokenContract, fetchStakingData]);

  const stake = useCallback(async (amount: string) => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para fazer stake.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const stakingContract = await getStakingContract();
      if (!stakingContract) throw new Error("Failed to get contract");

      const amountWei = parseEther(amount);
      const tx = await stakingContract.stake(amountWei);
      
      toast({
        title: "Stake enviado",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Stake concluído!",
        description: `${amount} TEA em stake com sucesso.`,
      });

      await fetchStakingData();
      return true;
    } catch (error: any) {
      console.error("Error staking:", error);
      toast({
        title: "Erro ao fazer stake",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getStakingContract, fetchStakingData]);

  const withdraw = useCallback(async (amount: string) => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para retirar.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const stakingContract = await getStakingContract();
      if (!stakingContract) throw new Error("Failed to get contract");

      const amountWei = parseEther(amount);
      const tx = await stakingContract.withdraw(amountWei);
      
      toast({
        title: "Retirada enviada",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Retirada concluída!",
        description: `${amount} TEA retirado com sucesso.`,
      });

      await fetchStakingData();
      return true;
    } catch (error: any) {
      console.error("Error withdrawing:", error);
      toast({
        title: "Erro ao retirar",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getStakingContract, fetchStakingData]);

  const claimRewards = useCallback(async () => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para resgatar recompensas.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const stakingContract = await getStakingContract();
      if (!stakingContract) throw new Error("Failed to get contract");

      const tx = await stakingContract.getReward();
      
      toast({
        title: "Resgate enviado",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Recompensas resgatadas!",
        description: "Suas recompensas foram enviadas para sua carteira.",
      });

      await fetchStakingData();
      return true;
    } catch (error: any) {
      console.error("Error claiming rewards:", error);
      toast({
        title: "Erro ao resgatar",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getStakingContract, fetchStakingData]);

  const exit = useCallback(async () => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para sair.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const stakingContract = await getStakingContract();
      if (!stakingContract) throw new Error("Failed to get contract");

      const tx = await stakingContract.exit();
      
      toast({
        title: "Saída enviada",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Saída concluída!",
        description: "Seus tokens e recompensas foram retirados.",
      });

      await fetchStakingData();
      return true;
    } catch (error: any) {
      console.error("Error exiting:", error);
      toast({
        title: "Erro ao sair",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getStakingContract, fetchStakingData]);

  return {
    stakedBalance,
    earnedRewards,
    teaBalance,
    totalStaked,
    rewardRate,
    allowance,
    isLoading,
    approve,
    stake,
    withdraw,
    claimRewards,
    exit,
    refreshData: fetchStakingData,
  };
};
