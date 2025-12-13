import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";
import { useWallet } from "./useWallet";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESSES } from "@/contracts/config";
import TEATokenABI from "@/contracts/TEAToken.json";
import TEAGovernorABI from "@/contracts/TEAGovernor.json";

interface ProposalInfo {
  id: string;
  proposer: string;
  description: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  state: number;
  voteStart: number;
  voteEnd: number;
}

export const useGovernance = () => {
  const { walletAddress, hasMetaMask } = useWallet();
  const [votingPower, setVotingPower] = useState<string>("0");
  const [delegatee, setDelegatee] = useState<string | null>(null);
  const [teaBalance, setTeaBalance] = useState<string>("0");
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

  const getGovernorContract = useCallback(async () => {
    const provider = getProvider();
    if (!provider) return null;
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESSES.TEA_GOVERNOR, TEAGovernorABI, signer);
  }, [getProvider]);

  const fetchVotingPower = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const provider = getProvider();
      if (!provider) return;
      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.TEA_TOKEN,
        TEATokenABI,
        provider
      );
      const votes = await tokenContract.getVotes(walletAddress);
      setVotingPower(formatEther(votes));
    } catch (error) {
      console.error("Error fetching voting power:", error);
    }
  }, [walletAddress, getProvider]);

  const fetchDelegatee = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const provider = getProvider();
      if (!provider) return;
      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.TEA_TOKEN,
        TEATokenABI,
        provider
      );
      const delegate = await tokenContract.delegates(walletAddress);
      setDelegatee(delegate === "0x0000000000000000000000000000000000000000" ? null : delegate);
    } catch (error) {
      console.error("Error fetching delegatee:", error);
    }
  }, [walletAddress, getProvider]);

  const fetchTeaBalance = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const provider = getProvider();
      if (!provider) return;
      const tokenContract = new Contract(
        CONTRACT_ADDRESSES.TEA_TOKEN,
        TEATokenABI,
        provider
      );
      const balance = await tokenContract.balanceOf(walletAddress);
      setTeaBalance(formatEther(balance));
    } catch (error) {
      console.error("Error fetching TEA balance:", error);
    }
  }, [walletAddress, getProvider]);

  useEffect(() => {
    if (walletAddress) {
      fetchVotingPower();
      fetchDelegatee();
      fetchTeaBalance();
    }
  }, [walletAddress, fetchVotingPower, fetchDelegatee, fetchTeaBalance]);

  const activateVoting = useCallback(async () => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para ativar os votos.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const tokenContract = await getTokenContract();
      if (!tokenContract) throw new Error("Failed to get contract");

      const tx = await tokenContract.delegate(walletAddress);
      toast({
        title: "Transação enviada",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Votos ativados!",
        description: "Você agora pode votar nas propostas de governança.",
      });

      await fetchVotingPower();
      await fetchDelegatee();
      return true;
    } catch (error: any) {
      console.error("Error activating voting:", error);
      toast({
        title: "Erro ao ativar votos",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getTokenContract, fetchVotingPower, fetchDelegatee]);

  const castVote = useCallback(async (proposalId: string, support: number) => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para votar.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const governorContract = await getGovernorContract();
      if (!governorContract) throw new Error("Failed to get contract");

      const tx = await governorContract.castVote(proposalId, support);
      toast({
        title: "Voto enviado",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      const voteType = support === 1 ? "a favor" : support === 0 ? "contra" : "abstenção";
      toast({
        title: "Voto registrado!",
        description: `Seu voto ${voteType} foi registrado com sucesso.`,
      });

      return true;
    } catch (error: any) {
      console.error("Error casting vote:", error);
      toast({
        title: "Erro ao votar",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getGovernorContract]);

  const getProposalState = useCallback(async (proposalId: string): Promise<number | null> => {
    try {
      const provider = getProvider();
      if (!provider) return null;
      const governorContract = new Contract(
        CONTRACT_ADDRESSES.TEA_GOVERNOR,
        TEAGovernorABI,
        provider
      );
      const state = await governorContract.state(proposalId);
      return Number(state);
    } catch (error) {
      console.error("Error getting proposal state:", error);
      return null;
    }
  }, [getProvider]);

  const hasVoted = useCallback(async (proposalId: string): Promise<boolean> => {
    if (!walletAddress) return false;
    try {
      const provider = getProvider();
      if (!provider) return false;
      const governorContract = new Contract(
        CONTRACT_ADDRESSES.TEA_GOVERNOR,
        TEAGovernorABI,
        provider
      );
      return await governorContract.hasVoted(proposalId, walletAddress);
    } catch (error) {
      console.error("Error checking if voted:", error);
      return false;
    }
  }, [walletAddress, getProvider]);

  return {
    votingPower,
    delegatee,
    teaBalance,
    isLoading,
    activateVoting,
    castVote,
    getProposalState,
    hasVoted,
    isVotingActive: delegatee?.toLowerCase() === walletAddress?.toLowerCase(),
  };
};

// Proposal state mapping
export const PROPOSAL_STATES = {
  0: { label: "Pendente", color: "bg-yellow-500" },
  1: { label: "Ativa", color: "bg-green-500" },
  2: { label: "Cancelada", color: "bg-red-500" },
  3: { label: "Derrotada", color: "bg-red-500" },
  4: { label: "Aprovada", color: "bg-green-500" },
  5: { label: "Em Fila", color: "bg-blue-500" },
  6: { label: "Expirada", color: "bg-gray-500" },
  7: { label: "Executada", color: "bg-purple-500" },
} as const;
