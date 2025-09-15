import { useState, useCallback } from "react";

export interface NFTModalData {
  nftId: string;
  title: string;
  imageUrl?: string;
  creator: string;
  // Add more fields as needed
}

export function useNFTDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [nftData, setNftData] = useState<NFTModalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = useCallback((data: NFTModalData) => {
    setNftData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setNftData(null);
    setIsLoading(false);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isOpen,
    nftData,
    isLoading,
    openModal,
    closeModal,
    setLoading,
  };
}
