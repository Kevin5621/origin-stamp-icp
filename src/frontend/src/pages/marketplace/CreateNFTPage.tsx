import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  X, 
  Plus, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { MarketplaceService } from '../../services/marketplaceService';
import type { CreateNFTData } from '../../types/marketplace';

const CreateNFTPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CreateNFTData>({
    title: '',
    description: '',
    price: '',
    currency: 'ICP',
    tags: [],
    collection: '',
    file: null
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a FileList-like object for validation
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => index === 0 ? file : null,
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as FileList;

      // Validate file
      const validation = MarketplaceService.validateFiles(fileList);
      if (validation.invalid.length > 0) {
        setErrors({ file: validation.invalid[0].reason });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const validation = MarketplaceService.validateFiles(files);
      if (validation.invalid.length > 0) {
        setErrors({ file: validation.invalid[0].reason });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleInputChange = (field: keyof CreateNFTData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
    setPreviewUrl('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('marketplace.create.titleRequired', 'Title is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('marketplace.create.descriptionRequired', 'Description is required');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('marketplace.create.priceRequired', 'Valid price is required');
    }

    if (!formData.file) {
      newErrors.file = t('marketplace.create.fileRequired', 'Please select a file');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const newNFT = await MarketplaceService.createNFT(formData);
      console.log('NFT created:', newNFT);
      navigate('/marketplace');
    } catch (error) {
      console.error('Failed to create NFT:', error);
      setErrors({ submit: t('marketplace.create.createFailed', 'Failed to create NFT') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-nft-page">
      <div className="create-nft-page__header">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          {t('marketplace.create.back', 'Back')}
        </button>
        <h1>
          {t('marketplace.create.title', 'Create New NFT')}
        </h1>
      </div>

      <div className="create-nft-page__content">
        <div className="create-nft-page__upload-section">
          <div className="form-section">
            <h2>
              {t('marketplace.create.uploadFile', 'Upload File')}
            </h2>
            
            <div className="upload-area">
              {!previewUrl ? (
                <div
                  className="upload-area"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={48} className="upload-icon" />
                  <div className="upload-text">
                    {t('marketplace.create.dragAndDrop', 'Drag and drop your file here')}
                  </div>
                  <div className="upload-subtext">
                    {t('marketplace.create.orClickToBrowse', 'or click to browse')}
                  </div>
                  <div className="upload-formats">
                    {t('marketplace.create.supportedFormats', 'Supported formats: JPG, PNG, GIF, WebP (Max 10MB)')}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className="file-preview">
                  <div className="file-preview__header">
                    <h3>Selected File</h3>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={handleRemoveFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <img src={previewUrl} alt="Preview" className="file-preview__image" />
                  <div className="file-preview__info">
                    <span>{formData.file?.name}</span>
                    <span>
                      {formData.file ? (formData.file.size / 1024 / 1024).toFixed(2) : '0'} MB
                    </span>
                  </div>
                </div>
              )}
              
              {errors.file && (
                <p className="error">{errors.file}</p>
              )}
            </div>
          </div>
        </div>

        <div className="create-nft-page__form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>
                {t('marketplace.create.nftDetails', 'NFT Details')}
              </h2>
              
              <div className="form-group">
                <label htmlFor="title">
                  {t('marketplace.create.titleLabel', 'Title')} <span className="required">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={t('marketplace.create.titlePlaceholder', 'Enter NFT title')}
                  maxLength={100}
                />
                {errors.title && <p className="error">{errors.title}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  {t('marketplace.create.description', 'Description')} <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('marketplace.create.descriptionPlaceholder', 'Describe your NFT')}
                  rows={4}
                  maxLength={1000}
                />
                {errors.description && <p className="error">{errors.description}</p>}
              </div>

              <div className="price-group">
                <div className="form-group">
                  <label htmlFor="price">
                    {t('marketplace.create.price', 'Price')} <span className="required">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="error">{errors.price}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                  >
                    <option value="ICP">ICP</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="collection">
                  {t('marketplace.create.collection', 'Collection')}
                </label>
                <input
                  id="collection"
                  type="text"
                  value={formData.collection}
                  onChange={(e) => handleInputChange('collection', e.target.value)}
                  placeholder={t('marketplace.create.collectionPlaceholder', 'Collection name (optional)')}
                />
              </div>

              <div className="form-group">
                <label>
                  {t('marketplace.create.tags', 'Tags')}
                </label>
                <div className="tags-group">
                  <div className="tags-input">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder={t('marketplace.create.addTag', 'Add tag')}
                      maxLength={20}
                    />
                    <button
                      type="button"
                      className="add-tag-btn"
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button
                          type="button"
                          className="remove-tag"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="originstamp-section">
                <div className="originstamp-section__header">
                  <CheckCircle className="icon" />
                  <h3>
                    {t('marketplace.create.originStamp', 'OriginStamp Verification')}
                  </h3>
                </div>
                <div className="originstamp-section__description">
                  {t('marketplace.create.originStampDescription', 'Your NFT will be automatically verified with OriginStamp, providing proof of creation process and authenticity.')}
                </div>
                <div className="originstamp-section__benefits">
                  <div className="benefit">
                    <CheckCircle className="icon" />
                    {t('marketplace.create.benefit1', 'Immutable creation history')}
                  </div>
                  <div className="benefit">
                    <CheckCircle className="icon" />
                    {t('marketplace.create.benefit2', 'Proof of authenticity')}
                  </div>
                  <div className="benefit">
                    <CheckCircle className="icon" />
                    {t('marketplace.create.benefit3', 'Enhanced value and trust')}
                  </div>
                </div>
              </div>
            </div>

            {errors.submit && (
              <p className="error">{errors.submit}</p>
            )}
            
            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  {t('marketplace.create.creating', 'Creating...')}
                </>
              ) : (
                <>
                  <Plus size={20} />
                  {t('marketplace.create.createNFT', 'Create NFT')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNFTPage; 