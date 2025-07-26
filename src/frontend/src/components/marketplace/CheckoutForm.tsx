import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CreditCard,
  Wallet,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  Clock,
} from "lucide-react";
import type { NFT } from "../../types/marketplace";

interface CheckoutFormProps {
  items: Array<{
    nft: NFT;
    quantity: number;
  }>;
  onCheckout: (
    paymentMethod: "icp" | "card",
    paymentDetails: any,
  ) => Promise<void>;
  loading?: boolean;
}

interface CheckoutData {
  paymentMethod: "icp" | "card";
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  walletAddress?: string;
  agreeToTerms: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  items,
  onCheckout,
  loading = false,
}) => {
  const { t } = useTranslation();

  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    paymentMethod: "icp",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.nft.price.amount) * item.quantity;
  }, 0);

  const gasFee = 0.01; // Fixed gas fee for ICP
  const platformFee = subtotal * 0.025; // 2.5% platform fee
  const total = subtotal + gasFee + platformFee;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!checkoutData.agreeToTerms) {
      newErrors.terms = t("must_agree_to_terms");
    }

    if (checkoutData.paymentMethod === "card" && checkoutData.cardDetails) {
      const { number, expiry, cvv, name } = checkoutData.cardDetails;

      if (!number || number.length < 16) {
        newErrors.cardNumber = t("invalid_card_number");
      }

      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.cardExpiry = t("invalid_expiry_date");
      }

      if (!cvv || cvv.length < 3) {
        newErrors.cardCvv = t("invalid_cvv");
      }

      if (!name || name.trim().length < 2) {
        newErrors.cardName = t("invalid_cardholder_name");
      }
    }

    if (checkoutData.paymentMethod === "icp" && !checkoutData.walletAddress) {
      newErrors.wallet = t("wallet_connection_required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onCheckout(checkoutData.paymentMethod, checkoutData);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const updateCardDetails = (field: string, value: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [field]: value,
      } as any,
    }));

    // Clear error when user starts typing
    if (errors[`card${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[
          `card${field.charAt(0).toUpperCase() + field.slice(1)}`
        ];
        return newErrors;
      });
    }
  };

  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit} className="checkout-form__form">
        {/* Order Summary */}
        <div className="checkout-form__section">
          <h3 className="checkout-form__section-title">
            <Info size={20} />
            {t("order_summary")}
          </h3>

          <div className="checkout-form__order-items">
            {items.map((item) => (
              <div key={item.nft.id} className="checkout-form__order-item">
                <div className="checkout-form__item-image">
                  <img src={item.nft.imageUrl} alt={item.nft.title} />
                </div>
                <div className="checkout-form__item-details">
                  <h4 className="checkout-form__item-title">
                    {item.nft.title}
                  </h4>
                  <p className="checkout-form__item-creator">
                    @{item.nft.creator.username}
                  </p>
                  <div className="checkout-form__item-price">
                    {item.nft.price.amount} {item.nft.price.currency}
                    {item.quantity > 1 && (
                      <span className="checkout-form__item-quantity">
                        × {item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="checkout-form__breakdown">
            <div className="checkout-form__breakdown-row">
              <span>{t("subtotal")}</span>
              <span>{subtotal.toFixed(3)} ICP</span>
            </div>
            <div className="checkout-form__breakdown-row">
              <span>{t("gas_fee")}</span>
              <span>{gasFee.toFixed(3)} ICP</span>
            </div>
            <div className="checkout-form__breakdown-row">
              <span>{t("platform_fee")}</span>
              <span>{platformFee.toFixed(3)} ICP</span>
            </div>
            <div className="checkout-form__breakdown-row checkout-form__breakdown-total">
              <span>{t("total")}</span>
              <span>{total.toFixed(3)} ICP</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="checkout-form__section">
          <h3 className="checkout-form__section-title">
            <CreditCard size={20} />
            {t("payment_method")}
          </h3>

          <div className="checkout-form__payment-methods">
            <label className="checkout-form__payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="icp"
                checked={checkoutData.paymentMethod === "icp"}
                onChange={(e) =>
                  setCheckoutData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value as "icp" | "card",
                  }))
                }
              />
              <div className="checkout-form__payment-content">
                <Wallet size={24} />
                <div>
                  <span className="checkout-form__payment-title">
                    ICP Wallet
                  </span>
                  <span className="checkout-form__payment-subtitle">
                    {t("pay_with_icp_wallet")}
                  </span>
                </div>
              </div>
            </label>

            <label className="checkout-form__payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={checkoutData.paymentMethod === "card"}
                onChange={(e) =>
                  setCheckoutData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value as "icp" | "card",
                  }))
                }
              />
              <div className="checkout-form__payment-content">
                <CreditCard size={24} />
                <div>
                  <span className="checkout-form__payment-title">
                    {t("credit_card")}
                  </span>
                  <span className="checkout-form__payment-subtitle">
                    {t("pay_with_credit_card")}
                  </span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Payment Details */}
        {checkoutData.paymentMethod === "card" && (
          <div className="checkout-form__section">
            <h4 className="checkout-form__subsection-title">
              {t("card_details")}
            </h4>

            <div className="checkout-form__card-fields">
              <div className="checkout-form__field">
                <label className="checkout-form__label">
                  {t("card_number")}
                </label>
                <input
                  type="text"
                  className={`wireframe-input ${errors.cardNumber ? "wireframe-input--error" : ""}`}
                  placeholder="1234 5678 9012 3456"
                  value={checkoutData.cardDetails?.number || ""}
                  onChange={(e) => updateCardDetails("number", e.target.value)}
                />
                {errors.cardNumber && (
                  <span className="checkout-form__error">
                    {errors.cardNumber}
                  </span>
                )}
              </div>

              <div className="checkout-form__field-row">
                <div className="checkout-form__field">
                  <label className="checkout-form__label">
                    {t("expiry_date")}
                  </label>
                  <input
                    type="text"
                    className={`wireframe-input ${errors.cardExpiry ? "wireframe-input--error" : ""}`}
                    placeholder="MM/YY"
                    value={checkoutData.cardDetails?.expiry || ""}
                    onChange={(e) =>
                      updateCardDetails("expiry", e.target.value)
                    }
                  />
                  {errors.cardExpiry && (
                    <span className="checkout-form__error">
                      {errors.cardExpiry}
                    </span>
                  )}
                </div>

                <div className="checkout-form__field">
                  <label className="checkout-form__label">{t("cvv")}</label>
                  <input
                    type="text"
                    className={`wireframe-input ${errors.cardCvv ? "wireframe-input--error" : ""}`}
                    placeholder="123"
                    value={checkoutData.cardDetails?.cvv || ""}
                    onChange={(e) => updateCardDetails("cvv", e.target.value)}
                  />
                  {errors.cardCvv && (
                    <span className="checkout-form__error">
                      {errors.cardCvv}
                    </span>
                  )}
                </div>
              </div>

              <div className="checkout-form__field">
                <label className="checkout-form__label">
                  {t("cardholder_name")}
                </label>
                <input
                  type="text"
                  className={`wireframe-input ${errors.cardName ? "wireframe-input--error" : ""}`}
                  placeholder={t("enter_cardholder_name")}
                  value={checkoutData.cardDetails?.name || ""}
                  onChange={(e) => updateCardDetails("name", e.target.value)}
                />
                {errors.cardName && (
                  <span className="checkout-form__error">
                    {errors.cardName}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection for ICP */}
        {checkoutData.paymentMethod === "icp" && (
          <div className="checkout-form__section">
            <div className="checkout-form__wallet-status">
              {checkoutData.walletAddress ? (
                <div className="checkout-form__wallet-connected">
                  <CheckCircle size={20} />
                  <span>{t("wallet_connected")}</span>
                  <code className="checkout-form__wallet-address">
                    {checkoutData.walletAddress.slice(0, 8)}...
                    {checkoutData.walletAddress.slice(-6)}
                  </code>
                </div>
              ) : (
                <div className="checkout-form__wallet-disconnected">
                  <AlertTriangle size={20} />
                  <span>{t("wallet_not_connected")}</span>
                  <button
                    type="button"
                    className="btn-wireframe btn-wireframe--small"
                    onClick={() => {
                      // Mock wallet connection
                      setCheckoutData((prev) => ({
                        ...prev,
                        walletAddress: "abcde-fghij-klmno-pqrst-uvwxy",
                      }));
                    }}
                  >
                    {t("connect_wallet")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="checkout-form__section">
          <label className="checkout-form__terms">
            <input
              type="checkbox"
              checked={checkoutData.agreeToTerms}
              onChange={(e) =>
                setCheckoutData((prev) => ({
                  ...prev,
                  agreeToTerms: e.target.checked,
                }))
              }
            />
            <span className="checkout-form__terms-text">
              {t("agree_to_terms_and_conditions")}
            </span>
          </label>
          {errors.terms && (
            <span className="checkout-form__error">{errors.terms}</span>
          )}
        </div>

        {/* Security Notice */}
        <div className="checkout-form__security-notice">
          <Shield size={16} />
          <span>{t("secure_transaction_notice")}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !checkoutData.agreeToTerms}
          className="btn-wireframe btn-wireframe--primary btn-wireframe--large checkout-form__submit"
        >
          {loading ? (
            <>
              <Clock size={20} />
              <span>{t("processing")}</span>
            </>
          ) : (
            <>
              <Calculator size={20} />
              <span>
                {t("complete_purchase")} • {total.toFixed(3)} ICP
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
