import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { MarketplaceService } from '../../services/marketplaceService';
import CheckoutForm from '../../components/marketplace/CheckoutForm';
import type { NFT } from '../../types/marketplace';

interface CheckoutItem {
  nft: NFT;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadCheckoutItems();
  }, [searchParams]);

  const loadCheckoutItems = async () => {
    setLoading(true);
    try {
      const nftIds = searchParams.get('items')?.split(',') || [];
      
      if (nftIds.length === 0) {
        navigate('/marketplace');
        return;
      }

      const checkoutItems: CheckoutItem[] = [];
      
      for (const nftId of nftIds) {
        const nft = await MarketplaceService.getNFTById(nftId);
        if (nft) {
          checkoutItems.push({
            nft,
            quantity: 1 // For now, NFTs are unique so quantity is always 1
          });
        }
      }

      if (checkoutItems.length === 0) {
        setError(t('no_valid_items_found'));
        return;
      }

      setItems(checkoutItems);
    } catch (error) {
      console.error('Failed to load checkout items:', error);
      setError(t('failed_to_load_items'));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (paymentMethod: 'icp' | 'card', paymentDetails: any) => {
    setProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock transaction
      const mockTransactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      
      // In a real app, this would call the payment service
      console.log('Processing payment:', {
        items,
        paymentMethod,
        paymentDetails,
        transactionId: mockTransactionId
      });

      setTransactionId(mockTransactionId);
      setOrderComplete(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(t('checkout_failed'));
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToMarketplace = () => {
    navigate('/marketplace');
  };

  const handleViewTransaction = () => {
    // In a real app, this would navigate to a transaction detail page
    console.log('View transaction:', transactionId);
  };

  const handleContinueShopping = () => {
    navigate('/marketplace');
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__header">
          <button
            onClick={() => navigate(-1)}
            className="btn-wireframe btn-wireframe--secondary"
          >
            <ArrowLeft size={20} />
            <span>{t('back')}</span>
          </button>
          <h1 className="checkout-page__title">{t('checkout')}</h1>
        </div>
        
        <div className="checkout-page__loading">
          <Clock size={48} />
          <p>{t('loading_checkout_items')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__header">
          <button
            onClick={handleBackToMarketplace}
            className="btn-wireframe btn-wireframe--secondary"
          >
            <ArrowLeft size={20} />
            <span>{t('back_to_marketplace')}</span>
          </button>
          <h1 className="checkout-page__title">{t('checkout')}</h1>
        </div>
        
        <div className="checkout-page__error">
          <AlertCircle size={48} />
          <h2>{t('checkout_error')}</h2>
          <p>{error}</p>
          <button
            onClick={handleBackToMarketplace}
            className="btn-wireframe btn-wireframe--primary"
          >
            {t('back_to_marketplace')}
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__success">
          <div className="checkout-page__success-icon">
            <CheckCircle size={64} />
          </div>
          
          <h1 className="checkout-page__success-title">{t('order_completed')}</h1>
          <p className="checkout-page__success-message">{t('order_success_message')}</p>
          
          <div className="checkout-page__transaction-info wireframe-card">
            <h3>{t('transaction_details')}</h3>
            <div className="checkout-page__transaction-row">
              <span>{t('transaction_id')}:</span>
              <code>{transactionId}</code>
            </div>
            <div className="checkout-page__transaction-row">
              <span>{t('items_purchased')}:</span>
              <span>{items.length}</span>
            </div>
            <div className="checkout-page__transaction-row">
              <span>{t('total_amount')}:</span>
              <span>
                {items.reduce((sum, item) => sum + parseFloat(item.nft.price.amount), 0).toFixed(3)} ICP
              </span>
            </div>
          </div>
          
          <div className="checkout-page__success-actions">
            <button
              onClick={handleViewTransaction}
              className="btn-wireframe btn-wireframe--primary"
            >
              {t('view_transaction')}
            </button>
            <button
              onClick={handleContinueShopping}
              className="btn-wireframe btn-wireframe--secondary"
            >
              {t('continue_shopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__header">
        <button
          onClick={() => navigate(-1)}
          className="btn-wireframe btn-wireframe--secondary"
        >
          <ArrowLeft size={20} />
          <span>{t('back')}</span>
        </button>
        <h1 className="checkout-page__title">
          <ShoppingCart size={24} />
          {t('checkout')}
        </h1>
      </div>

      <div className="checkout-page__content">
        <div className="checkout-page__main">
          <CheckoutForm
            items={items}
            onCheckout={handleCheckout}
            loading={processing}
          />
        </div>
        
        <div className="checkout-page__sidebar">
          <div className="checkout-page__summary wireframe-card">
            <h3 className="checkout-page__summary-title">{t('order_summary')}</h3>
            
            <div className="checkout-page__summary-items">
              {items.map((item) => (
                <div key={item.nft.id} className="checkout-page__summary-item">
                  <div className="checkout-page__summary-item-image">
                    <img src={item.nft.imageUrl} alt={item.nft.title} />
                  </div>
                  <div className="checkout-page__summary-item-details">
                    <h4>{item.nft.title}</h4>
                    <p>@{item.nft.creator.username}</p>
                    <span className="checkout-page__summary-item-price">
                      {item.nft.price.amount} {item.nft.price.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout-page__summary-total">
              <div className="checkout-page__summary-row">
                <span>{t('subtotal')}:</span>
                <span>
                  {items.reduce((sum, item) => sum + parseFloat(item.nft.price.amount), 0).toFixed(3)} ICP
                </span>
              </div>
              <div className="checkout-page__summary-row">
                <span>{t('gas_fee')}:</span>
                <span>0.001 ICP</span>
              </div>
              <div className="checkout-page__summary-row">
                <span>{t('platform_fee')}:</span>
                <span>
                  {(items.reduce((sum, item) => sum + parseFloat(item.nft.price.amount), 0) * 0.025).toFixed(3)} ICP
                </span>
              </div>
              <div className="checkout-page__summary-row checkout-page__summary-total-row">
                <span>{t('total')}:</span>
                <span>
                  {(items.reduce((sum, item) => sum + parseFloat(item.nft.price.amount), 0) * 1.025 + 0.001).toFixed(3)} ICP
                </span>
              </div>
            </div>
          </div>
          
          <div className="checkout-page__security wireframe-card">
            <h4>{t('secure_checkout')}</h4>
            <p>{t('secure_checkout_description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
