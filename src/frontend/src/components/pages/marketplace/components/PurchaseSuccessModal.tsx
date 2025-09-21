import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, ExternalLink, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string;
  price: string;
  currency: string;
  collectionName: string;
  transactionId: string;
}

export const PurchaseSuccessModal: React.FC<PurchaseSuccessModalProps> = ({
  isOpen,
  onClose,
  nftId,
  price,
  currency,
  collectionName,
  transactionId,
}) => {
  const router = useRouter();

  const handleViewCollection = () => {
    onClose();
    router.push("/dashboard/collection");
  };

  const handleViewTransaction = () => {
    // In a real implementation, this would link to a blockchain explorer
    alert(`Transaction ID: ${transactionId}\n\nIn a real implementation, this would link to a blockchain explorer.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Purchase Successful!
          </DialogTitle>
          <DialogDescription>
            Your NFT has been successfully purchased and added to your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <CheckCircle className="h-16 w-16 text-primary opacity-20" />
              </div>
            </div>
          </div>

          {/* NFT Details */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold text-lg">{collectionName}</h3>
            <p className="text-sm text-muted-foreground">NFT ID: {nftId}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Price Paid:</span>
              <span className="font-semibold">
                {price} {currency}
              </span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Transaction ID:</span>
              <span className="text-xs font-mono text-muted-foreground">
                {transactionId.slice(0, 8)}...{transactionId.slice(-8)}
              </span>
            </div>
          </div>

        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleViewTransaction}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Transaction
          </Button>
          <Button
            onClick={handleViewCollection}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
