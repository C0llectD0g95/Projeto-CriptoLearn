import { useState, useCallback, useEffect } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import { useWallet } from "./useWallet";
import { toast } from "@/hooks/use-toast";
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from "@/contracts/config";
import TEATokenABI from "@/contracts/TEAToken.json";
import TEAGovernorABI from "@/contracts/TEAGovernor.json";

// TEA Token uses 6 decimals
const TEA_DECIMALS = 6;

export interface ProposalInfo {
  id: string;
  proposer: string;
  title: string;
  description: string;
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  state: number;
  voteStart: number;
  voteEnd: number;
}

export const useGovernance = () => {
  const { walletAddress, hasMetaMask, isCorrectNetwork } = useWallet();
  const [votingPower, setVotingPower] = useState<string>("0");
  const [delegatee, setDelegatee] = useState<string | null>(null);
  const [teaBalance, setTeaBalance] = useState<string>("0");
  const [proposals, setProposals] = useState<ProposalInfo[]>([]);
  const [proposalThreshold, setProposalThreshold] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);

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
      setVotingPower(formatUnits(votes, TEA_DECIMALS));
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
      setTeaBalance(formatUnits(balance, TEA_DECIMALS));
    } catch (error) {
      console.error("Error fetching TEA balance:", error);
    }
  }, [walletAddress, getProvider]);

  const fetchProposalThreshold = useCallback(async () => {
    try {
      const provider = getProvider();
      if (!provider) return;
      const governorContract = new Contract(
        CONTRACT_ADDRESSES.TEA_GOVERNOR,
        TEAGovernorABI,
        provider
      );
      const threshold = await governorContract.proposalThreshold();
      setProposalThreshold(formatUnits(threshold, TEA_DECIMALS));
    } catch (error) {
      console.error("Error fetching proposal threshold:", error);
    }
  }, [getProvider]);

  const fetchProposals = useCallback(async () => {
    if (!isCorrectNetwork) return;
    
    setIsLoadingProposals(true);
    try {
      const provider = getProvider();
      if (!provider) return;

      const governorContract = new Contract(
        CONTRACT_ADDRESSES.TEA_GOVERNOR,
        TEAGovernorABI,
        provider
      );

      // Get ProposalCreated events
      const filter = governorContract.filters.ProposalCreated();
      const events = await governorContract.queryFilter(filter, 0, "latest");

      const proposalPromises = events.map(async (event: any) => {
        const proposalId = event.args.proposalId.toString();
        const proposer = event.args.proposer;
        const description = event.args.description || "";

        try {
          // Get proposal state
          const state = await governorContract.state(proposalId);
          
          // Get vote counts
          const votes = await governorContract.proposalVotes(proposalId);
          
          // Get vote deadlines
          const voteStart = await governorContract.proposalSnapshot(proposalId);
          const voteEnd = await governorContract.proposalDeadline(proposalId);

          // Parse title from description (first line or first 50 chars)
          const lines = description.split('\n');
          const title = lines[0].length > 60 ? lines[0].substring(0, 60) + '...' : lines[0];

          return {
            id: proposalId,
            proposer: proposer,
            title: title || `Proposta #${proposalId.slice(0, 8)}...`,
            description: description,
            forVotes: formatUnits(votes.forVotes || votes[1] || 0n, TEA_DECIMALS),
            againstVotes: formatUnits(votes.againstVotes || votes[0] || 0n, TEA_DECIMALS),
            abstainVotes: formatUnits(votes.abstainVotes || votes[2] || 0n, TEA_DECIMALS),
            state: Number(state),
            voteStart: Number(voteStart) * 1000,
            voteEnd: Number(voteEnd) * 1000,
          };
        } catch (error) {
          console.error(`Error fetching proposal ${proposalId}:`, error);
          return null;
        }
      });

      const fetchedProposals = (await Promise.all(proposalPromises)).filter(
        (p): p is ProposalInfo => p !== null
      );

      // Sort by most recent first
      fetchedProposals.sort((a, b) => b.voteEnd - a.voteEnd);
      setProposals(fetchedProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoadingProposals(false);
    }
  }, [getProvider, isCorrectNetwork]);

  useEffect(() => {
    if (walletAddress && isCorrectNetwork) {
      fetchVotingPower();
      fetchDelegatee();
      fetchTeaBalance();
      fetchProposals();
      fetchProposalThreshold();
    }
  }, [walletAddress, isCorrectNetwork, fetchVotingPower, fetchDelegatee, fetchTeaBalance, fetchProposals, fetchProposalThreshold]);

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

  const createProposal = useCallback(async (title: string, description: string) => {
    if (!walletAddress || !hasMetaMask) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira MetaMask para criar uma proposta.",
        variant: "destructive",
      });
      return false;
    }

    // Check if user has enough voting power
    const votingPowerNum = parseFloat(votingPower);
    const thresholdNum = parseFloat(proposalThreshold);
    if (votingPowerNum < thresholdNum) {
      toast({
        title: "Poder de voto insuficiente",
        description: `Você precisa de pelo menos ${proposalThreshold} TEA em poder de voto para criar uma proposta.`,
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const governorContract = await getGovernorContract();
      if (!governorContract) throw new Error("Failed to get contract");

      // For a simple proposal without execution, we use empty arrays for targets, values, and calldatas
      // The description contains the title and body
      const fullDescription = `${title}\n\n${description}`;
      
      const tx = await governorContract.propose(
        [], // targets
        [], // values
        [], // calldatas
        fullDescription
      );

      toast({
        title: "Proposta enviada",
        description: "Aguardando confirmação na blockchain...",
      });

      await tx.wait();
      
      toast({
        title: "Proposta criada!",
        description: "Sua proposta foi registrada na blockchain.",
      });

      await fetchProposals();
      return true;
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Erro ao criar proposta",
        description: error.reason || error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, hasMetaMask, getGovernorContract, fetchProposals, votingPower, proposalThreshold]);

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

      await fetchProposals();
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
  }, [walletAddress, hasMetaMask, getGovernorContract, fetchProposals]);

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
    proposals,
    proposalThreshold,
    isLoading,
    isLoadingProposals,
    activateVoting,
    createProposal,
    castVote,
    getProposalState,
    hasVoted,
    fetchProposals,
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
