import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Share2, 
  Eye, 
  Calendar, 
  Tag, 
  CheckCircle, 
  ArrowLeft,
  ExternalLink,
  Clock
} from 'lucide-react';
import { MarketplaceService } from '../../services/marketplaceService';
import type { NFT } from '../../types/marketplace';

const NFTDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [nft, setNft] = useState<NFT | null>(null);
  const [relatedNFTs, setRelatedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (id) {
      loadNFT();
      loadRelatedNFTs();
    }
  }, [id]);

  const loadNFT = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await MarketplaceService.getNFTById(id);
      setNft(data);
    } catch (error) {
      console.error('Failed to load NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedNFTs = async () => {
    if (!id) return;
    
    try {
      const allNFTs = await MarketplaceService.getNFTs();
      const currentNFT = allNFTs.find(n => n.id === id);
      if (currentNFT) {
        const related = allNFTs
          .filter(n => n.id !== id && n.creator.username === currentNFT.creator.username)
          .slice(0, 4);
        setRelatedNFTs(related);
      }
    } catch (error) {
      console.error('Failed to load related NFTs:', error);
    }
  };

  const handleLike = async () => {
    if (!nft) return;
    
    try {
      if (isLiked) {
        await MarketplaceService.unlikeNFT(nft.id);
      } else {
        await MarketplaceService.likeNFT(nft.id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like/unlike NFT:', error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: nft?.title,
        text: nft?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBuy = async () => {
    if (!nft) return;
    
    setBuying(true);
    try {
      const result = await MarketplaceService.buyNFT(nft.id, 'current-user-id');
      if (result.success) {
        navigate(`/marketplace/checkout?nft=${nft.id}&tx=${result.transactionId}`);
      } else {
        alert(result.error || 'Failed to purchase NFT');
      }
    } catch (error) {
      console.error('Failed to buy NFT:', error);
      alert('Failed to purchase NFT');
    } finally {
      setBuying(false);
    }
  };

  const handleCreatorClick = () => {
    if (nft) {
      navigate(`/marketplace/profile/${nft.creator.username}`);
    }
  };

  const handleRelatedNFTClick = (nftId: string) => {
    navigate(`/marketplace/nft/${nftId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="nft-detail-loading">
        <div className="loading-skeleton wireframe-card">
          <div className="skeleton-image-large"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="nft-detail-error">
        <h2>{t('marketplace.nftDetail.notFound', 'NFT Not Found')}</h2>
        <p>{t('marketplace.nftDetail.notFoundDescription', 'The NFT you are looking for does not exist or has been removed.')}</p>
        <button
          className="btn-wireframe btn-wireframe--primary"
          onClick={() => navigate('/marketplace')}
        >
          {t('marketplace.nftDetail.backToMarketplace', 'Back to Marketplace')}
        </button>
      </div>
    );
  }

  return (
    <div className="nft-detail-page">
      {/* Back Button */}
      <div className="nft-detail__header">
        <button
          className="btn-wireframe btn-wireframe--secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          {t('marketplace.nftDetail.back', 'Back')}
        </button>
      </div>

      <div className="nft-detail__content">
        {/* Main NFT Display */}
        <div className="nft-detail__main">
          <div className="nft-detail__image-container">
            <img 
              src={nft.imageUrl} 
              alt={nft.title}
              className="nft-detail__image"
            />
            
            {/* OriginStamp Badge */}
            {nft.originStamp.verified && (
              <div className="nft-detail__originstamp-badge">
                <CheckCircle size={20} />
                <span>OriginStamp Verified</span>
              </div>
            )}
          </div>

          <div className="nft-detail__info">
            <div className="nft-detail__header-info">
              <h1 className="nft-detail__title">{nft.title}</h1>
              
              <div className="nft-detail__actions">
                <button
                  className="nft-detail__action-btn"
                  onClick={handleLike}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart size={20} className={isLiked ? 'filled' : ''} />
                  <span>{nft.likes}</span>
                </button>
                
                <button
                  className="nft-detail__action-btn"
                  onClick={handleShare}
                  aria-label="Share"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="nft-detail__creator" onClick={handleCreatorClick}>
              <img 
                src={nft.creator.avatar} 
                alt={nft.creator.username}
                className="nft-detail__creator-avatar"
              />
              <div className="nft-detail__creator-info">
                <span className="nft-detail__creator-name">
                  {nft.creator.username}
                  {nft.creator.verified && (
                    <CheckCircle size={16} className="verified-icon" />
                  )}
                </span>
                <span className="nft-detail__creator-label">
                  {t('marketplace.nftDetail.creator', 'Creator')}
                </span>
              </div>
            </div>

            <div className="nft-detail__description">
              <h3>{t('marketplace.nftDetail.description', 'Description')}</h3>
              <p>{nft.description}</p>
            </div>

            <div className="nft-detail__metadata">
              <div className="nft-detail__metadata-item">
                <Calendar size={16} />
                <span>{t('marketplace.nftDetail.created', 'Created')}: {formatDate(nft.createdAt)}</span>
              </div>
              
              <div className="nft-detail__metadata-item">
                <Eye size={16} />
                <span>{t('marketplace.nftDetail.views', 'Views')}: {nft.views.toLocaleString()}</span>
              </div>
              
              {nft.collection && (
                <div className="nft-detail__metadata-item">
                  <Tag size={16} />
                  <span>{t('marketplace.nftDetail.collection', 'Collection')}: {nft.collection}</span>
                </div>
              )}
            </div>

            <div className="nft-detail__tags">
              {nft.tags.map((tag, index) => (
                <span key={index} className="nft-detail__tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase Section */}
        <div className="nft-detail__purchase">
          <div className="nft-detail__price-card wireframe-card">
            <div className="nft-detail__price-info">
              <span className="nft-detail__price-label">
                {t('marketplace.nftDetail.currentPrice', 'Current Price')}
              </span>
              <div className="nft-detail__price">
                <span className="nft-detail__price-amount">
                  {nft.price.amount} {nft.price.currency}
                </span>
              </div>
            </div>

            {nft.status === 'for_sale' && (
              <button
                className="btn-wireframe btn-wireframe--primary nft-detail__buy-btn"
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? t('marketplace.nftDetail.buying', 'Processing...') : t('marketplace.nftDetail.buyNow', 'Buy Now')}
              </button>
            )}

            {nft.status === 'auction' && (
              <div className="nft-detail__auction-info">
                <div className="nft-detail__auction-time">
                  <Clock size={16} />
                  <span>{t('marketplace.nftDetail.auctionEnds', 'Auction ends in 2 days')}</span>
                </div>
                <button className="btn-wireframe btn-wireframe--secondary">
                  {t('marketplace.nftDetail.placeBid', 'Place Bid')}
                </button>
              </div>
            )}

            {nft.status === 'sold' && (
              <div className="nft-detail__sold-info">
                <span className="nft-detail__sold-badge">
                  {t('marketplace.nftDetail.sold', 'Sold')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OriginStamp Certificate */}
      {nft.originStamp.verified && (
        <section className="nft-detail__certificate">
          <div className="nft-detail__certificate-card wireframe-card">
            <h3 className="nft-detail__certificate-title">
              <CheckCircle size={20} />
              {t('marketplace.nftDetail.originStampCertificate', 'OriginStamp Certificate')}
            </h3>
            
            <div className="nft-detail__certificate-content">
              <p>
                {t('marketplace.nftDetail.certificateDescription', 'This artwork has been verified with OriginStamp, providing proof of the creation process and authenticity.')}
              </p>
              
              <div className="nft-detail__certificate-details">
                <div className="nft-detail__certificate-item">
                  <span className="certificate-label">
                    {t('marketplace.nftDetail.certificateId', 'Certificate ID')}:
                  </span>
                  <span className="certificate-value">{nft.originStamp.certificateId}</span>
                </div>
                
                <div className="nft-detail__certificate-item">
                  <span className="certificate-label">
                    {t('marketplace.nftDetail.creationProcess', 'Creation Process')}:
                  </span>
                  <span className="certificate-value">
                    {nft.originStamp.creationProcess ? 
                      t('marketplace.nftDetail.verified', 'Verified') : 
                      t('marketplace.nftDetail.notVerified', 'Not Verified')
                    }
                  </span>
                </div>
              </div>
              
              <button className="btn-wireframe btn-wireframe--secondary">
                <ExternalLink size={16} />
                {t('marketplace.nftDetail.viewCertificate', 'View Certificate')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Related NFTs */}
      {relatedNFTs.length > 0 && (
        <section className="nft-detail__related">
          <h3 className="nft-detail__related-title">
            {t('marketplace.nftDetail.moreFromCreator', 'More from this creator')}
          </h3>
          
          <div className="nft-detail__related-grid">
            {relatedNFTs.map((relatedNFT) => (
              <div 
                key={relatedNFT.id} 
                className="nft-detail__related-item"
                onClick={() => handleRelatedNFTClick(relatedNFT.id)}
              >
                <img src={relatedNFT.imageUrl} alt={relatedNFT.title} />
                <div className="nft-detail__related-info">
                  <h4>{relatedNFT.title}</h4>
                  <p>{relatedNFT.price.amount} {relatedNFT.price.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NFTDetailPage; 