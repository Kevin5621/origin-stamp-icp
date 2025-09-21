use candid::{CandidType, Deserialize, Principal};
use ic_cdk::caller;
use serde::Serialize;
use std::collections::HashMap;

// ICRC-1 Types for ICP Ledger
#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub struct Account {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub struct TransferArgs {
    pub from_subaccount: Option<Vec<u8>>,
    pub to: Account,
    pub amount: u64,
    pub fee: Option<u64>,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
}

#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub enum TransferError {
    BadFee { expected_fee: u64 },
    BadBurn { min_burn_amount: u64 },
    InsufficientFunds { balance: u64 },
    TooOld,
    CreatedInFuture { ledger_time: u64 },
    Duplicate { duplicate_of: u64 },
    TemporarilyUnavailable,
    GenericError { error_code: u64, message: String },
}

#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub enum TransferResult {
    Ok(u64),
    Err(TransferError),
}

#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub struct ICPBalance {
    pub e8s: u64,
    pub formatted: String,
    pub decimal: u8,
}

// Trading system types
#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub struct PurchaseRequest {
    pub token_id: u64,
    pub seller: Account,
    pub buyer: Account,
    pub price: u64,       // in e8s
    pub currency: String, // "ICP" or "USDT"
}

#[derive(CandidType, Deserialize, Clone, Debug, Serialize)]
pub struct PurchaseResult {
    pub success: bool,
    pub message: String,
    pub transaction_id: Option<u64>,
    pub nft_transferred: bool,
}

// Storage for trading state
thread_local! {
    static TRADING_HISTORY: std::cell::RefCell<HashMap<u64, TradingRecord>> = std::cell::RefCell::new(HashMap::new());
    static PENDING_PURCHASES: std::cell::RefCell<HashMap<u64, PurchaseRequest>> = std::cell::RefCell::new(HashMap::new());
}

#[derive(Clone, Debug, Serialize, Deserialize, CandidType)]
pub struct TradingRecord {
    pub transaction_id: u64,
    pub token_id: u64,
    pub seller: Account,
    pub buyer: Account,
    pub price: u64,
    pub currency: String,
    pub timestamp: u64,
    pub status: String, // "completed", "pending", "failed"
}

// ICP Ledger Integration Functions

/// Get ICP balance for an account
#[ic_cdk::query]
pub async fn get_icp_balance(_account: Account) -> Result<ICPBalance, String> {
    // For local development, return mock balance
    // In production, this would call the real ICP Ledger
    Ok(ICPBalance {
        e8s: 1_000_000_000, // 10 ICP in e8s
        formatted: "10.00 ICP".to_string(),
        decimal: 8,
    })
}

/// Check if ICP Ledger is available
#[ic_cdk::query]
pub async fn is_icp_ledger_available() -> bool {
    // For local development, return false to use mock
    // In production, this would check if ICP Ledger canister is responding
    false
}

/// Transfer ICP between accounts
#[ic_cdk::update]
pub async fn transfer_icp(
    to: Account,
    amount: u64,
    memo: Option<Vec<u8>>,
) -> Result<TransferResult, String> {
    let _caller_account = Account {
        owner: caller(),
        subaccount: None,
    };

    let _transfer_args = TransferArgs {
        from_subaccount: None,
        to,
        amount,
        fee: Some(10_000), // 0.0001 ICP fee
        memo,
        created_at_time: Some(ic_cdk::api::time()),
    };

    // For local development, simulate successful transfer
    // In production, this would call the real ICP Ledger
    Ok(TransferResult::Ok(ic_cdk::api::time()))
}

/// Purchase NFT with ICP
#[ic_cdk::update]
pub async fn purchase_nft_with_icp(
    token_id: u64,
    seller: Account,
    price: u64,
) -> Result<PurchaseResult, String> {
    let buyer = Account {
        owner: caller(),
        subaccount: None,
    };

    // 1. Verify buyer has sufficient balance
    let buyer_balance = get_icp_balance(buyer.clone()).await?;
    if buyer_balance.e8s < price {
        return Ok(PurchaseResult {
            success: false,
            message: "Insufficient ICP balance".to_string(),
            transaction_id: None,
            nft_transferred: false,
        });
    }

    // 2. Create purchase request
    let _purchase_request = PurchaseRequest {
        token_id,
        seller: seller.clone(),
        buyer: buyer.clone(),
        price,
        currency: "ICP".to_string(),
    };

    // 3. Process ICP transfer
    let transfer_result = transfer_icp(seller.clone(), price, None).await?;

    match transfer_result {
        TransferResult::Ok(transaction_id) => {
            // 4. Transfer NFT ownership (this would call NFT module)
            // For now, we'll simulate success
            let nft_transferred = true; // TODO: Implement actual NFT transfer

            // 5. Record the transaction
            let trading_record = TradingRecord {
                transaction_id,
                token_id,
                seller: seller.clone(),
                buyer: buyer.clone(),
                price,
                currency: "ICP".to_string(),
                timestamp: ic_cdk::api::time(),
                status: "completed".to_string(),
            };

            TRADING_HISTORY.with(|history| {
                history.borrow_mut().insert(transaction_id, trading_record);
            });

            Ok(PurchaseResult {
                success: true,
                message: "NFT purchased successfully".to_string(),
                transaction_id: Some(transaction_id),
                nft_transferred,
            })
        }
        TransferResult::Err(error) => Ok(PurchaseResult {
            success: false,
            message: format!("Transfer failed: {error:?}"),
            transaction_id: None,
            nft_transferred: false,
        }),
    }
}

/// Get trading history for a user
#[ic_cdk::query]
pub fn get_user_trading_history(user_principal: Principal) -> Vec<TradingRecord> {
    TRADING_HISTORY.with(|history| {
        history
            .borrow()
            .values()
            .filter(|record| {
                record.buyer.owner == user_principal || record.seller.owner == user_principal
            })
            .cloned()
            .collect()
    })
}

/// Get all trading records (admin function)
#[ic_cdk::query]
pub fn get_all_trading_history() -> Vec<TradingRecord> {
    TRADING_HISTORY.with(|history| history.borrow().values().cloned().collect())
}

/// Get trading statistics
#[ic_cdk::query]
pub fn get_trading_stats() -> (u64, u64, u64) {
    TRADING_HISTORY.with(|history| {
        let records = history.borrow();
        let total_transactions = records.len() as u64;
        let total_volume: u64 = records.values().map(|r| r.price).sum();
        let completed_transactions =
            records.values().filter(|r| r.status == "completed").count() as u64;

        (total_transactions, total_volume, completed_transactions)
    })
}

/// Initialize trading system with demo data
#[ic_cdk::update]
pub fn initialize_trading_system() -> Result<bool, String> {
    // Add some demo trading records
    let demo_records = vec![TradingRecord {
        transaction_id: 1,
        token_id: 1,
        seller: Account {
            owner: Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap(),
            subaccount: None,
        },
        buyer: Account {
            owner: caller(),
            subaccount: None,
        },
        price: 100_000_000, // 1 ICP
        currency: "ICP".to_string(),
        timestamp: ic_cdk::api::time(),
        status: "completed".to_string(),
    }];

    TRADING_HISTORY.with(|history| {
        let mut history_map = history.borrow_mut();
        for record in demo_records {
            history_map.insert(record.transaction_id, record);
        }
    });

    Ok(true)
}

/// Mock function to add ICP balance for testing
#[ic_cdk::update]
pub fn add_mock_icp_balance(account: Account, amount: u64) -> Result<bool, String> {
    // This is for local development only
    // In production, this would not exist
    ic_cdk::println!("Mock: Adding {} e8s to account {:?}", amount, account);
    Ok(true)
}

/// Get account balance (mock implementation)
#[ic_cdk::query]
pub fn get_account_balance(_account: Account) -> ICPBalance {
    // Mock balance for development
    ICPBalance {
        e8s: 1_000_000_000, // 10 ICP
        formatted: "10.00 ICP".to_string(),
        decimal: 8,
    }
}

/// Get trading history for a user
#[ic_cdk::query]
pub fn get_trading_history(user: String) -> Vec<TradingRecord> {
    TRADING_HISTORY.with(|history| {
        history
            .borrow()
            .iter()
            .filter(|(_, record)| {
                record.buyer.owner.to_string() == user || record.seller.owner.to_string() == user
            })
            .map(|(_, record)| record.clone())
            .collect()
    })
}
