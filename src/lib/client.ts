/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserCategoryDto {
  /** @format int64 */
  id?: number;
  name?: string;
  status?: "ACTIVE" | "INACTIVE";
  buySpread?: number;
  sellSpread?: number;
  buyFeeRate?: number;
  sellFeeRate?: number;
  code?: string;
}

/** Entity to create */
export interface Product {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  code?: string;
  /** @format int32 */
  settlementDays?: number;
  allowsLeverage?: boolean;
  hasExpiry?: boolean;
  hasFunding?: boolean;
  active?: boolean;
  description?: string;
  settlementTime?: string;
  minTradeQuantity?: number;
  maxTradeQuantity?: number;
  maxSingleOrderValue?: number;
  maxDailyVolumePerUser?: number;
  /** @format int32 */
  maxDailyOrdersPerUser?: number;
  walletTypeCode?: string;
}

export interface PhysicalDeliveryStatusChangeDto {
  status?:
    | "REQUESTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "SCHEDULED"
    | "READY_FOR_PICKUP"
    | "DELIVERED"
    | "CANCELED"
    | "EXPIRED";
  reason?: string;
}

export interface PhysicalDeliveryScheduleDto {
  /** @format date */
  appointmentDate?: string;
  appointmentTimeSlot?: string;
}

export interface PhysicalDeliveryConfirmDto {
  otp?: string;
  signatureFileId?: string;
}

/** Entity to create */
export interface InvestmentPlan {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  name?: string;
  code?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  contract?: string;
  months?: string;
  interestRate?: number;
}

/** Entity to create */
export interface Faq {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  targetUserAccount?: UserAccount;
  title?: string;
  description?: string;
}

export interface GrantedAuthority {
  authority?: string;
}

export interface UserAccount {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nationalId?: string;
  /** @format date-time */
  birthDate?: string;
  username?: string;
  email?: string;
  passwordHash?: string;
  isKycVerified?: boolean;
  userLevel?: "NORMAL" | "VIP" | "COLLEAGUE";
  referralCode?: string;
  accountReferralCode?: string;
  referredBy?: UserAccount;
  /** @format date-time */
  updatedAt?: string;
  secondAuthType?: "SMS" | "GOOGLE";
  secondAuthSecret?: string;
  status?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  type?: UserType;
  /** @format int64 */
  partyId?: number;
  userRole?: "USER" | "ADMIN";
  enabled?: boolean;
  password?: string;
  authorities?: GrantedAuthority[];
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  accountNonLocked?: boolean;
}

export interface UserType {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  description?: string;
  code?: string;
  /** @format int64 */
  id?: number;
}

/** Entity to create */
export interface ApplicationConfig {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  description?: string;
  key?: string;
  value?: string;
  /** @format date-time */
  date?: string;
}

export interface UpdateProfileRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserInfoDto {
  /** @format int64 */
  id?: number;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  category?: string;
  nationalId?: string;
  email?: string;
  /** @format date-time */
  birthDate?: string;
  userLevel?: "NORMAL" | "VIP" | "COLLEAGUE";
  isKycVerified?: boolean;
  status?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  referralCode?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface ChartPreferencesDto {
  defaultTimeframe?: string;
  chartType?: string;
  indicators?: string[];
  showGrid?: boolean;
  colorTheme?: string;
}

export interface NotificationSettingsDto {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  tradeNotifications?: boolean;
  priceAlerts?: boolean;
  systemUpdates?: boolean;
  marginCalls?: boolean;
  fundingCharges?: boolean;
  referralUpdates?: boolean;
}

export interface UserPreferencesDto {
  baseCurrency?: string;
  language?: string;
  theme?: string;
  chartPreferences?: ChartPreferencesDto;
  notificationPreferences?: NotificationSettingsDto;
  favoriteMarkets?: string[];
}

export interface LanguageDto {
  language?: string;
}

export interface BaseCurrencyDto {
  currency?: string;
}

export interface UpdateBankAccountDto {
  bankName?: string;
  iban?: string;
  ownerName?: string;
}

export interface UpdateApiKeyDto {
  name?: string;
  permissions?: string[];
  ipWhitelist?: string[];
}

export interface VerifyCodeDto {
  code?: string;
  reference?: string;
}

export interface OtpResponse {
  key?: string;
}

export interface AuthenticationRequest {
  username?: string;
  password?: string;
}

export interface AuthenticationResponse {
  sessionId?: string;
  access_token?: string;
  refresh_token?: string;
  /** @format int32 */
  expired?: number;
}

export interface ChangeAuthPasswordDto {
  username?: string;
  oldPassword?: string;
  newPassword?: string;
  otpKey?: string;
  otp?: string;
}

export interface BiometricLoginRequest {
  credentialId?: string;
  authenticatorData?: string;
  clientDataJson?: string;
  signature?: string;
  userHandle?: string;
  /** @format int64 */
  signCount?: number;
}

export interface FinancialAccountFilterDto {
  accountNumber?: string;
  accountTypeCode?: string;
  accountTypeCodes?: string[];
  accountTypeCategoryCode?: string;
  accountTypeId?: string;
  providerCode?: string;
  providerId?: string;
  accountStatusCode?: string;
  /** @format int64 */
  partyId?: number;
  assetTypeCode?: string;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface AccountStatusDto {
  code?: string;
  description?: string;
}

export interface AccountTypeDto {
  code?: string;
  description?: string;
}

export interface AssetTypeDto {
  /** @format int64 */
  id?: number;
  code?: string;
  name?: string;
  symbol?: string;
  unit?: string;
}

export interface BalanceResponse {
  balance?: number;
  availableBalance?: number;
  blockBalance?: number;
  currency?: AssetTypeDto;
}

export interface FinancialAccountDto {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  accountId?: number;
  accountNumber?: string;
  description?: string;
  currency?: AssetTypeDto;
  balances?: BalanceResponse;
  provider?: ProviderDto;
  /** @format int64 */
  partyId?: number;
  name?: string;
  type?: AccountTypeDto;
  status?: AccountStatusDto;
  createdJalaliDate?: string;
  /** @format date-time */
  openDate?: string;
}

export interface ProviderDto {
  name?: string;
  code?: string;
}

export interface TransferToMarginWallet {
  currency?: string;
  amount?: number;
}

export interface AccountTransactionsDto {
  /** @format int64 */
  id?: number;
  transactionType?: TransactionTypeDto;
  requestType?:
    | "ACCOUNT"
    | "A2A"
    | "CARD"
    | "SHEBA"
    | "PAYA"
    | "BUY"
    | "SELL"
    | "IPG_CHARGE_ACCOUNT"
    | "BASKET_TRANSACTION";
  transferType?: string;
  accountNumber?: string;
  fromAccountNumber?: string;
  fromAccountName?: string;
  destinationNumber?: string;
  destinationName?: string;
  person?: Record<string, object>;
  amount?: number;
  originalAmount?: number;
  currencyType?: string;
  balance?: number;
  transactionStatusType?: TransactionStatusTypeDto;
  referenceCode?: string;
  paymentNumber?: string;
  /** @format int64 */
  partyId?: number;
  note?: string;
  stan?: string;
  fee?: number;
  /** @format date-time */
  dateTime?: string;
  /** @format date-time */
  postDate?: string;
  jalaliDateTime?: string;
  description?: string;
  hostReferenceCode?: string;
  traceNumber?: string;
  operation?: TypeDto;
}

export interface TransactionStatusTypeDto {
  code?: string;
  description?: string;
}

export interface TransactionTypeDto {
  code?: string;
  description?: string;
  category?: string;
}

export interface TransferResponseDto {
  withdrawalTransaction?: AccountTransactionsDto;
  depositTransaction?: AccountTransactionsDto;
  status?: string;
}

export interface TypeDto {
  code?: string;
  description?: string;
}

export interface TransferWallet {
  destinationNumber?: string;
  description?: string;
  asset?: string;
  amount?: number;
}

export interface AccountTransactionFilter {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  partyId?: number;
  accountNumber?: string;
  transactionTypeCode?: string;
  transactionTypeCodes?: string[];
  /** @format int64 */
  transactionTypeId?: number;
  transactionStatusTypeCode?: string;
  /** @format int64 */
  transactionStatusTypeId?: number;
  fromAmount?: number;
  toAmount?: number;
  referenceCode?: string;
  paymentNumber?: string;
  assetTypeCode?: string;
  stan?: string;
  /** @format date-time */
  fromEntryDate?: string;
  /** @format date-time */
  toEntryDate?: string;
  /** @format date-time */
  fromPostDate?: string;
  /** @format date-time */
  toPostDate?: string;
  traceNumber?: string;
  /** @format int32 */
  from?: number;
  /** @format int32 */
  size?: number;
}

export interface AccountTransactionsPaged {
  /** @format int64 */
  count?: number;
  transactions?: AccountTransactionsDto[];
}

export interface ChargeAccountDto {
  amount?: number;
}

export interface ChargeIpgResponseDto {
  link?: string;
  token?: string;
  uuid?: string;
}

export interface CashOutRequestDto {
  asset?:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  iban?: string;
  cardNumber?: string;
  amount?: number;
}

export interface CashoutResponseDto {
  reference?: string;
}

/** Price quote request DTO */
export interface PriceQuoteRequest {
  /**
   * Asset code
   * @example "GOLD"
   */
  assetCode: string;
  /**
   * Order amount for volume-based pricing
   * @min 0.0001
   * @exclusiveMin false
   * @example 10.5
   */
  amount: number;
}

/** Base response DTO for API responses */
export interface ApiResponsePriceQuote {
  /**
   * HTTP status code
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * Response message
   * @example "Operation completed successfully"
   */
  message?: string;
  /** DTO for price quotation */
  data?: PriceQuote;
  /**
   * Response timestamp
   * @format date-time
   */
  timestamp?: string;
  /**
   * API endpoint path
   * @example "/api/v1/users"
   */
  path?: string;
}

/** DTO for price quotation */
export interface PriceQuote {
  /**
   * Asset for which price is quoted
   * @example "GOLD"
   */
  asset:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  /**
   * Final price after applying spread
   * @example 1895.75
   */
  finalPrice: number;
  /**
   * Timestamp when the quote was generated
   * @format date-time
   */
  quoteTime?: string;
  /**
   * Unique identifier for the price quote
   * @example "QUOTE_20240115_143000"
   */
  quoteId?: string;
  /**
   * Validity duration of the quote in seconds
   * @format int32
   * @example 30
   */
  validitySeconds?: number;
  /**
   * Tenor/delivery term for the price quote
   * @example "T_PLUS_0"
   */
  tenor?: "MARGIN" | "T_PLUS_1" | "T_PLUS_2" | "FORWARD_T2" | "FORWARD_T1";
  /**
   * Source of the market price
   * @example "INTERNAL_FEED"
   */
  priceSource?: string;
  fee?: number;
}

export interface PhysicalDeliveryCreateDto {
  assetType?: string;
  assetCode?: string;
  requestedQuantity?: number;
  purity?: number;
  deliveryLocation?: string;
  receiverFullName?: string;
  receiverNationalId?: string;
  receiverMobile?: string;
}

export interface PhysicalDeliveryResponseDto {
  /** @format int64 */
  id?: number;
  requestCode?: string;
  assetType?: string;
  assetCode?: string;
  requestedQuantity?: number;
  approvedQuantity?: number;
  unit?: string;
  purity?: number;
  unitPriceAtApproval?: number;
  valuationAmount?: number;
  deliveryLocation?: string;
  /** @format date */
  appointmentDate?: string;
  appointmentTimeSlot?: string;
  status?:
    | "REQUESTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "SCHEDULED"
    | "READY_FOR_PICKUP"
    | "DELIVERED"
    | "CANCELED"
    | "EXPIRED";
  /** @format date-time */
  deliveredAt?: string;
  /** @format date-time */
  requestedDate?: string;
  /** @format date-time */
  readyDate?: string;
  customer?: UserAccountDto;
  warehouse?: string;
}

export interface UserAccountDto {
  /** @format int64 */
  id?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nationalId?: string;
  /** @format date-time */
  birthDate?: string;
  username?: string;
  email?: string;
  isKycVerified?: boolean;
  userLevel?: "NORMAL" | "VIP" | "COLLEAGUE";
  referralCode?: string;
  referredBy?: UserAccount;
  status?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  /** @format int64 */
  partyId?: number;
  type?: string;
  typeCode?: string;
  /** @format date-time */
  joinDate?: string;
}

export interface TradeFilter {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  orderId?: number;
  /** @format int64 */
  positionId?: number;
  /** @format int64 */
  walletTransactionId?: number;
  productCode?: string;
  /** @format int32 */
  from?: number;
  /** @format int32 */
  size?: number;
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  status?: string;
  username?: string;
  /** @format date-time */
  fromDate?: string;
  /** @format date-time */
  toDate?: string;
  fromQuantity?: number;
  toQuantity?: number;
  spread?: number;
  minimumAmount?: number;
  sortDate?: "DESC" | "ASC";
}

/** Response DTO after order placement */
export interface OrderDto {
  /**
   * Unique identifier of the created order
   * @format int64
   * @example 100001
   */
  orderId?: number;
  /**
   * Type of the order
   * @example "CASH"
   */
  orderType?: string;
  orderProductCode?: string;
  orderProduct?: string;
  /**
   * Side of the trade
   * @example "BUY"
   */
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  /**
   * Asset that was traded
   * @example "GOLD"
   */
  asset?:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  /**
   * Quantity of asset traded
   * @example 10.5
   */
  quantity?: number;
  /**
   * Unit price at which the trade was executed
   * @example 1895.75
   */
  unitPrice?: number;
  /**
   * Spread applied to the market price
   * @example 2.5
   */
  spread?: number;
  /**
   * Total amount of the order including all charges
   * @example 19905.38
   */
  totalAmount?: number;
  /**
   * Fee amount charged for the order
   * @example 99.53
   */
  fee?: number;
  /**
   * Current status of the order
   * @example "RESERVED"
   */
  status?: string;
  /**
   * Timestamp when the order was created
   * @format date-time
   */
  createdAt?: string;
  /**
   * Reservation ID for wallet operations
   * @example "RES_20240115_143000_12345"
   */
  reservationId?: string;
  /**
   * Tenor/delivery term for the order
   * @example "T_PLUS_0"
   */
  tenor?: "MARGIN" | "T_PLUS_1" | "T_PLUS_2" | "FORWARD_T2" | "FORWARD_T1";
  /** @format int64 */
  tradeId?: number;
  feeAmount?: number;
  walletTransactionId?: string;
  user?: UserAccountDto;
}

export interface PagedTradeResponse {
  trades?: TradeDto[];
  /** @format int64 */
  count?: number;
}

export interface PositionDetailsResponse {
  /** @format int64 */
  positionId?: number;
  asset?:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  quantity?: number;
  entryPrice?: number;
  markPrice?: number;
  leverage?: number;
  initialMargin?: number;
  maintenanceMargin?: number;
  unrealizedPnl?: number;
  realizedPnl?: number;
  tradeTerm?: "MARGIN" | "T_PLUS_1" | "T_PLUS_2" | "FORWARD_T2" | "FORWARD_T1";
  /** @format date-time */
  settlementDateTime?: string;
  liquidationPrice?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  status?:
    | "OPEN"
    | "PARTIALLY_CLOSED"
    | "CLOSED"
    | "LIQUIDATED"
    | "SETTLED"
    | "EXPIRED";
  /** @format date-time */
  openedAt?: string;
  riskLevel?: "SAFE" | "WARNING" | "CRITICAL" | "LIQUIDATION";
  marginLevel?: number;
  currentPrice?: number;
  totalValue?: number;
  profitLoss?: number;
  profitLossPercent?: number;
  marginRatio?: number;
}

export interface TradeDto {
  /** @format int64 */
  id?: number;
  /** Response DTO after order placement */
  order?: OrderDto;
  user?: UserAccountDto;
  productCode?: string;
  product?: string;
  quantity?: number;
  executionPrice?: number;
  marketPrice?: number;
  notional?: number;
  feeAmount?: number;
  feeRate?: number;
  spread?: number;
  /** @format date-time */
  executedAt?: string;
  position?: PositionDetailsResponse;
  walletTransactionId?: string;
}

export interface OrderFilter {
  /** @format int32 */
  from?: number;
  /** @format int32 */
  size?: number;
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  status?: string;
  username?: string;
  productCode?: string;
  /** @format date-time */
  fromDate?: string;
  /** @format date-time */
  toDate?: string;
  minimumAmount?: number;
}

export interface PagedOrderResponse {
  orders?: OrderDto[];
  /** @format int64 */
  count?: number;
}

/** Cash order request DTO */
export interface ExchangeRequestDto {
  /**
   * Asset code (e.g., GOLD, USDT)
   * @example "GOLD"
   */
  assetCode: string;
  /**
   * Order amount
   * @min 0.0001
   * @exclusiveMin false
   * @example 10.5
   */
  amount: number;
}

/** Base response DTO for API responses */
export interface ApiResponseOrderDto {
  /**
   * HTTP status code
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * Response message
   * @example "Operation completed successfully"
   */
  message?: string;
  /** Response DTO after order placement */
  data?: OrderDto;
  /**
   * Response timestamp
   * @format date-time
   */
  timestamp?: string;
  /**
   * API endpoint path
   * @example "/api/v1/users"
   */
  path?: string;
}

export interface InvestmentRequest {
  productCode?: string;
  amount?: number;
  currency?: string;
  description?: string;
}

export interface BiometricRegistrationRequest {
  deviceName?: string;
  deviceType?: string;
}

export interface BiometricRegistrationResponse {
  challenge?: string;
  rpId?: string;
  rpName?: string;
  userId?: string;
  userName?: string;
  displayName?: string;
  algorithms?: string[];
}

export interface BiometricRegistrationCompleteRequest {
  credentialId?: string;
  publicKey?: string;
  /** @format int64 */
  signCount?: number;
  challenge?: string;
}

export interface StandardResponse {
  /** @format int32 */
  code?: number;
  message?: string;
  data?: object;
  translate?: string;
  tranceNumber?: string;
}

export interface WithdrawalAccountRequest {
  fromAccount?: string;
  toAccount?: string;
  /** @format int64 */
  fromPartyId?: number;
  /** @format int64 */
  toPartyId?: number;
  toIdentifier?: string;
  amount?: number;
  depositId?: string;
  description?: string;
  currencyType?: string;
  transactionType?: string;
  fromBasket?: boolean;
  stan?: string;
}

export interface TransferRequestDto {
  fromAccountNumber?: string;
  toAccountNumber?: string;
  amount?: number;
  currency?: string;
  /** @format int64 */
  partyId?: number;
  description?: string;
  note?: string;
  traceNumber?: string;
  operation?: string;
  stan?: string;
  referenceNumber?: string;
}

export interface AccountChangeStatusDto {
  accountNumber?: string;
  /** @format int64 */
  facilityId?: number;
  statusCode?: string;
  comment?: string;
}

export interface DepositRequestDto {
  accountNumber?: string;
  amount?: number;
  description?: string;
  currency?: string;
  stan?: string;
  traceNumber?: string;
}

export interface UserAccountFilter {
  /** @format int64 */
  userId?: number;
  username?: string;
  mobileNumber?: string;
  name?: string;
  nationalId?: string;
  assetCode?: string;
  typeCode?: string;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
}

export interface PageUserAccount {
  users?: UserAccountDto[];
  /** @format int64 */
  count?: number;
}

export interface UserChangeStatusDto {
  status?: string;
}

export interface UserWalletDto {
  /** @format int64 */
  id?: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  nationalId?: string;
  /** @format date-time */
  birthDate?: string;
  username?: string;
  email?: string;
  status?: "ACTIVE" | "BLOCKED" | "SUSPENDED";
  /** @format int64 */
  partyId?: number;
  accountNumber?: string;
  balance?: number;
  blockedBalance?: number;
  marginBalance?: number;
  creditBalance?: number;
  creditLimit?: number;
  joinDate?: string;
  lastActivity?: string;
  marginRatio?: string;
  goldCash?: string;
  goldTomorrowDayAfter?: string;
  goldCommitment?: string;
  walletTransactions?: AccountTransactionsDto[];
}

export interface TotalFinancialAccountResponseDto {
  accounts?: FinancialAccountDto[];
  /** @format int64 */
  totalCountAccount?: number;
  totalBalance?: number;
  asset?: string;
}

export interface CashoutFilterDto {
  /** @format int64 */
  id?: number;
  statusType?: string;
  /** @format int64 */
  accountTransactionId?: number;
  externalReference?: string;
  stan?: string;
  destinationNumber?: string;
  /** @format int32 */
  from?: number;
  /** @format int32 */
  size?: number;
}

export interface CashoutDto {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  accountTransactionId?: number;
  destinationNumber?: string;
  destinationName?: string;
  amount?: number;
  statusType?:
    | "Requested"
    | "InProcessing"
    | "SentBank"
    | "Reject"
    | "Reverse"
    | "Cancelled"
    | "Completed";
  externalReference?: string;
  /** @format date-time */
  postDate?: string;
  reverseReference?: string;
  /** @format date-time */
  reverseDateTime?: string;
  stan?: string;
  /** @format date-time */
  entryDate?: string;
}

export interface CashoutChangeStatusRequestDto {
  /** @format int64 */
  id?: number;
  statusType?:
    | "Requested"
    | "InProcessing"
    | "SentBank"
    | "Reject"
    | "Reverse"
    | "Cancelled"
    | "Completed";
}

export interface InvestmentAccountDto {
  accountNumber?: string;
  assetType?: string;
  accountType?: string;
  accountTypeCode?: string;
  quantity?: number;
  currentValue?: number;
  creditGranted?: number;
  /** @format date-time */
  startDate?: string;
  /** @format date */
  endDate?: string;
  usableAsCollateral?: boolean;
  status?: string;
  statusCode?: string;
  annualRate?: string;
  annualRateType?: string;
}

export interface ResetPasswordDto {
  token?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AvatarUploadResponseDto {
  avatarUrl?: string;
}

export interface VerifyMobileDto {
  mobile?: string;
  code?: string;
}

export interface VerifyEmailDto {
  email?: string;
  code?: string;
}

export interface ForgotPasswordDto {
  mobile?: string;
  email?: string;
}

export interface ChangePasswordRequestDto {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AddRoDefaultBankAccountDto {
  /** @format int64 */
  id?: number;
}

export interface BankAccountDto {
  /** @format int64 */
  id?: number;
  bankName?: string;
  ownerName?: string;
  iban?: string;
  description?: string;
  isDefault?: boolean;
  status?: "ACTIVE" | "INACTIVE";
}

export interface CreateApiKeyDto {
  name?: string;
  permissions?: string[];
  ipWhitelist?: string[];
}

export interface ApiKeyCreateResponse {
  apiKey?: string;
  secretKey?: string;
}

export interface CreateUserAddressDto {
  aliasName?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  address?: string;
  countryCode?: string;
  phoneCode?: string;
  postalCode?: string;
}

export interface VerifyTwoFactorDto {
  secret?: string;
  code?: string;
}

export interface TwoFactorSetupDto {
  secret?: string;
  qrCodeUrl?: string;
}

export interface DisableTwoFactorDto {
  password?: string;
  code?: string;
}

export interface PositionCloseRequestDto {
  /** @format int64 */
  positionId?: number;
  closeQuantity?: number;
  closeType?:
    | "USER_REQUEST"
    | "STOP_LOSS"
    | "TAKE_PROFIT"
    | "LIQUIDATION"
    | "AUTO_SETTLEMENT"
    | "ADMIN_CLOSE";
  reason?: string;
}

export interface PositionCloseResponse {
  /** @format int64 */
  closeRequestId?: number;
  /** @format int64 */
  positionId?: number;
  closedQuantity?: number;
  closePrice?: number;
  pnl?: number;
  releasedMargin?: number;
  closeType?: string;
  status?: string;
  /** @format date-time */
  closedAt?: string;
}

export interface MarginOrderRequest {
  asset?:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  amount?: number;
  leverage?: number;
  tradeTerm?: "MARGIN" | "T_PLUS_1" | "T_PLUS_2" | "FORWARD_T2" | "FORWARD_T1";
  price?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  orderType?: string;
}

export interface MarginOrderResponse {
  /** @format int64 */
  orderId?: number;
  /** @format int64 */
  positionId?: number;
  asset?:
    | "GOLD"
    | "USDT"
    | "IRR"
    | "BTC"
    | "ETH"
    | "GOLD_18"
    | "GOLD_24"
    | "COPPER"
    | "GOLD_FORWARD_2"
    | "GOLD_FORWARD_1"
    | "SILVER"
    | "TMN";
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  quantity?: number;
  entryPrice?: number;
  leverage?: number;
  totalNotional?: number;
  requiredMargin?: number;
  liquidationPrice?: number;
  tradeTerm?: string;
  settlementDate?: string;
  status?: string;
  walletTransactionId?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  tradeId?: number;
}

export interface RegisterUserRequestDto {
  nationalCode?: string;
  birthDate?: string;
  mobileNumber?: string;
  password?: string;
  referralCode?: string;
  isColleague?: boolean;
  referenceCode?: string;
  clientOtp?: string;
}

export interface AccountBalanceResponse {
  accountNumber?: string;
  balance?: number;
  currency?: string;
}

/** Base response DTO for API responses */
export interface ApiResponseBigDecimal {
  /**
   * HTTP status code
   * @format int32
   * @example 200
   */
  status?: number;
  /**
   * Response message
   * @example "Operation completed successfully"
   */
  message?: string;
  /** Response data payload */
  data?: number;
  /**
   * Response timestamp
   * @format date-time
   */
  timestamp?: string;
  /**
   * API endpoint path
   * @example "/api/v1/users"
   */
  path?: string;
}

export interface InvestmentPlanDto {
  name?: string;
  code?: string;
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
  contract?: string;
  months?: string;
  interestRate?: number;
}

export interface BiometricCredentialDto {
  /** @format int64 */
  id?: number;
  deviceName?: string;
  deviceType?: string;
  /** @format date-time */
  lastUsed?: string;
  /** @format date-time */
  createdAt?: string;
  isActive?: boolean;
}

export interface UserAccountShowcase {
  /** @format int64 */
  userCount?: number;
  /** @format int64 */
  userActiveCount?: number;
  /** @format int64 */
  userTradeCount?: number;
  /** @format int64 */
  openMarginCount?: number;
  /** @format int64 */
  warningMarginCount?: number;
}

export interface TradeSummaryByCurrencyDto {
  productCode?: string;
  side?: "BUY" | "SELL" | "LONG" | "SHORT";
  totalQuantity?: number;
  totalNotional?: number;
  totalFee?: number;
  /** @format int64 */
  tradeCount?: number;
}

export interface PriceDto {
  currency?: string;
  price?: number;
}

export interface ShowcaseDto {
  /** @format int64 */
  allUserCount?: number;
  /** @format int64 */
  openMarginCount?: number;
  /** @format int64 */
  feeCount?: number;
  /** @format int64 */
  investmentCount?: number;
  /** @format int64 */
  alarmMarginCount?: number;
  /** @format int64 */
  spreedAmount?: number;
  /** @format int64 */
  volumeOfTransaction?: number;
  prices?: PriceDto[];
  treasury?: WalletAccountDto[];
}

export interface WalletAccountDto {
  accountNumber?: string;
  balance?: number;
  currency?: string;
  description?: string;
  type?: string;
}

export interface UsageDto {
  /** @format int32 */
  dailyOrdersUsed?: number;
  dailyVolumeUsed?: number;
  currentExposure?: number;
  currentLeverage?: number;
}

export interface TradingSummaryDto {
  /** @format int32 */
  todayOrders?: number;
  todayVolume?: number;
  todayPnl?: number;
  /** @format double */
  winRate?: number;
  /** @format double */
  avgHoldingPeriod?: number;
  bestTrade?: number;
  worstTrade?: number;
  /** @format int32 */
  totalWins?: number;
  /** @format int32 */
  totalLosses?: number;
}

export interface UserTierDto {
  code?: string;
  name?: string;
  buySpread?: number;
  sellSpread?: number;
  buyFeeRate?: number;
  sellFeeRate?: number;
  maxLeverage?: number;
  dailyWithdrawalLimit?: number;
}

export interface UserStatisticsDto {
  /** @format int32 */
  totalOrders?: number;
  /** @format int32 */
  totalMarginOrders?: number;
  /** @format int32 */
  totalTrades?: number;
  totalVolume?: number;
  /** @format int32 */
  totalReferrals?: number;
  totalReferralEarnings?: number;
  /** @format int32 */
  totalPhysicalRequests?: number;
  /** @format int64 */
  accountAgeDays?: number;
}

export interface UserSessionDto {
  sessionId?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string;
  /** @format date-time */
  lastActivity?: string;
  /** @format date-time */
  loginTime?: string;
  isCurrent?: boolean;
}

export interface ReferralDto {
  name?: string;
  mobile?: string;
  /** @format date-time */
  joinedAt?: string;
  volume?: number;
  earnings?: number;
}

export interface ReferralStatsDto {
  /** @format int32 */
  totalReferrals?: number;
  /** @format int64 */
  activeReferrals?: number;
  totalEarnings?: number;
  pendingEarnings?: number;
  paidEarnings?: number;
  referralCode?: string;
  recentReferrals?: ReferralDto[];
}

export interface SecurityStatusDto {
  twoFactorEnabled?: boolean;
  twoFactorType?: "SMS" | "GOOGLE";
  /** @format date-time */
  lastPasswordChange?: string;
  /** @format int32 */
  activeSessions?: number;
}

export interface PortfolioWalletSummaryDto {
  totalBalance?: number;
  items?: WalletSummeryBalanceDto[];
}

export interface WalletSummeryBalanceDto {
  balance?: number;
  equalBalance?: number;
  currency?: string;
  accountType?: string;
}

export interface AssetBalanceDto {
  asset?: string;
  balance?: number;
  available?: number;
  blocked?: number;
  valueInBaseCurrency?: number;
}

export interface PortfolioSummaryDto {
  totalBalance?: number;
  investmentBalance?: number;
  /** @format int64 */
  investmentCount?: number;
  marginBalance?: number;
  availableBalance?: number;
  blockedBalance?: number;
  openPositionsValue?: number;
  unrealizedPnl?: number;
  dailyPnl?: number;
  weeklyPnl?: number;
  monthlyPnl?: number;
  assetBreakdown?: AssetBalanceDto[];
}

export interface MarketSummertyBalanceDto {
  balance?: number;
  equalBalance?: number;
  currency?: string;
}

export interface PortfolioMarketSummaryDto {
  totalBalance?: number;
  items?: MarketSummertyBalanceDto[];
}

export interface NotificationDto {
  /** @format int64 */
  id?: number;
  type?: string;
  event?: string;
  payload?: string;
  status?: string;
  /** @format date-time */
  sentAt?: string;
}

export interface NotificationListResponse {
  notifications?: NotificationDto[];
  /** @format int64 */
  unreadCount?: number;
}

export interface LoginLog {
  /** @format date-time */
  version?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format int64 */
  id?: number;
  /** @format int64 */
  userId?: number;
  deviceType?: string;
  location?: string;
  browser?: string;
  ipAddress?: string;
  agent?: string;
  appVersion?: string;
  status?: boolean;
  /** @format date-time */
  date?: string;
}

export interface UserLimitsDto {
  /** @format int32 */
  dailyOrderLimit?: number;
  dailyVolumeLimit?: number;
  maxSingleOrderValue?: number;
  minTradeQuantity?: number;
  maxTradeQuantity?: number;
  maxExposure?: number;
  maxLeverage?: number;
  minLeverage?: number;
  /** @format int32 */
  usedDailyOrders?: number;
  usedDailyVolume?: number;
}

export interface KycStatusDto {
  isVerified?: boolean;
  level?: "NORMAL" | "VIP" | "COLLEAGUE";
  documentsUploaded?: boolean;
  pendingDocuments?: string[];
  rejectionReason?: string;
  verifiedAt?: string;
}

export interface KycLevelDto {
  level?: string;
  name?: string;
  requiredDocuments?: string[];
  benefits?: string[];
}

export interface KycDocumentDto {
  /** @format int64 */
  id?: number;
  type?: string;
  status?: string;
  fileName?: string;
  fileUrl?: string;
  /** @format date-time */
  uploadedAt?: string;
}

export interface ApiKeyDto {
  /** @format int64 */
  id?: number;
  name?: string;
  apiKey?: string;
  permissions?: string;
  ipWhitelist?: string[];
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  lastUsed?: string;
  enabled?: boolean;
}

export interface UserAddressDto {
  /** @format int64 */
  id?: number;
  address?: string;
  postalCode?: string;
  aliasName?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  email?: string;
  countryCode?: string;
  phoneCode?: string;
}

export interface TwoFactorStatusDto {
  enabled?: boolean;
  type?: "SMS" | "GOOGLE";
}

export interface MarketDto {
  id?: string;
  name?: string;
  nameEn?: string;
  enabled?: boolean;
  leverageOptions?: string[];
}

export interface FaqDto {
  title?: string;
  description?: string;
}

export interface RemoveBankAccountDto {
  /** @format int64 */
  id?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title OMS Product API
 * @version 1.0
 * @license MIT License (https://choosealicense.com/licenses/mit/)
 * @termsOfService https://clwco.ir
 * @baseUrl http://94.182.92.104:9092
 * @contact clwco team <contact@clwco.ir> (https://clwco.ir)
 *
 * OMS Product API
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Admin
     * @name UpdateUserCategory
     * @summary Update user category
     * @request PUT:/api/v1/admin/user/category
     */
    updateUserCategory: (data: UserCategoryDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/admin/user/category`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name CreateUserCategory
     * @summary Create user category
     * @request POST:/api/v1/admin/user/category
     */
    createUserCategory: (data: UserCategoryDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/admin/user/category`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves a specific entity by its unique identifier
     *
     * @tags Product Resource
     * @name GetById1
     * @summary Get entity by ID
     * @request GET:/api/v1/admin/product/{id}
     */
    getById1: (id: number, params: RequestParams = {}) =>
      this.request<Product, Product>({
        path: `/api/v1/admin/product/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates an existing entity with new data
     *
     * @tags Product Resource
     * @name Update
     * @summary Update an entity
     * @request PUT:/api/v1/admin/product/{id}
     */
    update: (id: number, data: Product, params: RequestParams = {}) =>
      this.request<Product, Product>({
        path: `/api/v1/admin/product/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes an entity from the system
     *
     * @tags Product Resource
     * @name Delete
     * @summary Delete an entity
     * @request DELETE:/api/v1/admin/product/{id}
     */
    delete: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/admin/product/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name DeliveryChangeStatus
     * @summary Change delivery status
     * @request PUT:/api/v1/admin/physical-deliveries/{id}/status
     */
    deliveryChangeStatus: (
      id: number,
      data: PhysicalDeliveryStatusChangeDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/physical-deliveries/${id}/status`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name Schedule
     * @summary Schedule appointment
     * @request PUT:/api/v1/admin/physical-deliveries/{id}/schedule
     */
    schedule: (
      id: number,
      data: PhysicalDeliveryScheduleDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/physical-deliveries/${id}/schedule`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name Deliver
     * @summary Confirm physical handover
     * @request PUT:/api/v1/admin/physical-deliveries/{id}/deliver
     */
    deliver: (
      id: number,
      data: PhysicalDeliveryConfirmDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/physical-deliveries/${id}/deliver`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves a specific entity by its unique identifier
     *
     * @tags Investment Resource
     * @name GetById2
     * @summary Get entity by ID
     * @request GET:/api/v1/admin/investment/{id}
     */
    getById2: (id: number, params: RequestParams = {}) =>
      this.request<InvestmentPlan, InvestmentPlan>({
        path: `/api/v1/admin/investment/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates an existing entity with new data
     *
     * @tags Investment Resource
     * @name Update1
     * @summary Update an entity
     * @request PUT:/api/v1/admin/investment/{id}
     */
    update1: (id: number, data: InvestmentPlan, params: RequestParams = {}) =>
      this.request<InvestmentPlan, InvestmentPlan>({
        path: `/api/v1/admin/investment/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes an entity from the system
     *
     * @tags Investment Resource
     * @name Delete1
     * @summary Delete an entity
     * @request DELETE:/api/v1/admin/investment/{id}
     */
    delete1: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/admin/investment/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Retrieves a specific entity by its unique identifier
     *
     * @tags FAQ Resource
     * @name GetById3
     * @summary Get entity by ID
     * @request GET:/api/v1/admin/faq/{id}
     */
    getById3: (id: number, params: RequestParams = {}) =>
      this.request<Faq, Faq>({
        path: `/api/v1/admin/faq/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates an existing entity with new data
     *
     * @tags FAQ Resource
     * @name Update2
     * @summary Update an entity
     * @request PUT:/api/v1/admin/faq/{id}
     */
    update2: (id: number, data: Faq, params: RequestParams = {}) =>
      this.request<Faq, Faq>({
        path: `/api/v1/admin/faq/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes an entity from the system
     *
     * @tags FAQ Resource
     * @name Delete2
     * @summary Delete an entity
     * @request DELETE:/api/v1/admin/faq/{id}
     */
    delete2: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/admin/faq/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Retrieves a specific entity by its unique identifier
     *
     * @tags Application Config Resource
     * @name GetById4
     * @summary Get entity by ID
     * @request GET:/api/v1/admin/application/config/{id}
     */
    getById4: (id: number, params: RequestParams = {}) =>
      this.request<ApplicationConfig, ApplicationConfig>({
        path: `/api/v1/admin/application/config/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Updates an existing entity with new data
     *
     * @tags Application Config Resource
     * @name Update3
     * @summary Update an entity
     * @request PUT:/api/v1/admin/application/config/{id}
     */
    update3: (
      id: number,
      data: ApplicationConfig,
      params: RequestParams = {},
    ) =>
      this.request<ApplicationConfig, ApplicationConfig>({
        path: `/api/v1/admin/application/config/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes an entity from the system
     *
     * @tags Application Config Resource
     * @name Delete3
     * @summary Delete an entity
     * @request DELETE:/api/v1/admin/application/config/{id}
     */
    delete3: (id: number, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/v1/admin/application/config/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UpdateProfile
     * @summary Update user profile
     * @request PUT:/api/v1/account/profile
     */
    updateProfile: (
      data: UpdateProfileRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<UserInfoDto, any>({
        path: `/api/v1/account/profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetUserPreferences
     * @summary Get user preferences
     * @request GET:/api/v1/account/preferences
     */
    getUserPreferences: (params: RequestParams = {}) =>
      this.request<UserPreferencesDto, any>({
        path: `/api/v1/account/preferences`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UpdateUserPreferences
     * @summary Update user preferences
     * @request PUT:/api/v1/account/preferences
     */
    updateUserPreferences: (
      data: UserPreferencesDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/preferences`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name SetLanguage
     * @summary Set language
     * @request PUT:/api/v1/account/preferences/language
     */
    setLanguage: (data: LanguageDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/preferences/language`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name SetBaseCurrency
     * @summary Set base currency
     * @request PUT:/api/v1/account/preferences/currency
     */
    setBaseCurrency: (data: BaseCurrencyDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/preferences/currency`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetNotificationSettings
     * @summary Get notification settings
     * @request GET:/api/v1/account/notification-settings
     */
    getNotificationSettings: (params: RequestParams = {}) =>
      this.request<NotificationSettingsDto, any>({
        path: `/api/v1/account/notification-settings`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UpdateNotificationSettings
     * @summary Update notification settings
     * @request PUT:/api/v1/account/notification-settings
     */
    updateNotificationSettings: (
      data: NotificationSettingsDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/notification-settings`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetBankAccountDetails
     * @summary Get bank account details
     * @request GET:/api/v1/account/bank/accounts/{id}
     */
    getBankAccountDetails: (id: number, params: RequestParams = {}) =>
      this.request<BankAccountDto, any>({
        path: `/api/v1/account/bank/accounts/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UpdateBankAccount
     * @summary Update bank account
     * @request PUT:/api/v1/account/bank/accounts/{id}
     */
    updateBankAccount: (
      id: number,
      data: UpdateBankAccountDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/bank/accounts/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UpdateApiKey
     * @summary Update API key permissions
     * @request PUT:/api/v1/account/api-keys/{id}
     */
    updateApiKey: (
      id: number,
      data: UpdateApiKeyDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/api-keys/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name DeleteApiKey
     * @summary Delete API key
     * @request DELETE:/api/v1/account/api-keys/{id}
     */
    deleteApiKey: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/api-keys/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetWallets
     * @summary Get wallets by filter
     * @request POST:/api/v1/wallet
     */
    getWallets: (data: FinancialAccountFilterDto, params: RequestParams = {}) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/wallet`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name WithdrawalMarginWallet
     * @summary Transfer from margin wallet to main wallet
     * @request POST:/api/v1/wallet/withdrawal/margin
     */
    withdrawalMarginWallet: (
      data: TransferToMarginWallet,
      params: RequestParams = {},
    ) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/wallet/withdrawal/margin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name Transfer
     * @summary Transfer request
     * @request POST:/api/v1/wallet/transfer
     */
    transfer: (data: TransferWallet, params: RequestParams = {}) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/wallet/transfer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetWalletTransactions
     * @summary Get wallet transaction paged
     * @request POST:/api/v1/wallet/transactions
     */
    getWalletTransactions: (
      data: AccountTransactionFilter,
      params: RequestParams = {},
    ) =>
      this.request<AccountTransactionsPaged, any>({
        path: `/api/v1/wallet/transactions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetTransactionTypes
     * @summary Transaction Types
     * @request POST:/api/v1/wallet/transaction/types
     */
    getTransactionTypes: (params: RequestParams = {}) =>
      this.request<TransactionTypeDto[], any>({
        path: `/api/v1/wallet/transaction/types`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name CreateMarginWallet
     * @summary Create margin wallet
     * @request POST:/api/v1/wallet/margin
     */
    createMarginWallet: (
      data: TransferToMarginWallet,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/wallet/margin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name DepositMarginWallet
     * @summary Transfer from main wallet to margin wallet
     * @request POST:/api/v1/wallet/deposit/margin
     */
    depositMarginWallet: (
      data: TransferToMarginWallet,
      params: RequestParams = {},
    ) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/wallet/deposit/margin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name ChargeWallet
     * @summary Charge Rial wallet
     * @request POST:/api/v1/wallet/charge
     */
    chargeWallet: (data: ChargeAccountDto, params: RequestParams = {}) =>
      this.request<ChargeIpgResponseDto, any>({
        path: `/api/v1/wallet/charge`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name Cashout
     * @summary Cashout request
     * @request POST:/api/v1/wallet/cashout
     */
    cashout: (data: CashOutRequestDto, params: RequestParams = {}) =>
      this.request<CashoutResponseDto, any>({
        path: `/api/v1/wallet/cashout`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pricing
     * @name GetSellPriceQuote
     * @summary Get sell price quote
     * @request POST:/api/v1/pricing/quote/sell
     */
    getSellPriceQuote: (data: PriceQuoteRequest, params: RequestParams = {}) =>
      this.request<ApiResponsePriceQuote, any>({
        path: `/api/v1/pricing/quote/sell`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pricing
     * @name GetBuyPriceQuote
     * @summary Get buy price quote
     * @request POST:/api/v1/pricing/quote/buy
     */
    getBuyPriceQuote: (data: PriceQuoteRequest, params: RequestParams = {}) =>
      this.request<ApiResponsePriceQuote, any>({
        path: `/api/v1/pricing/quote/buy`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Physical Delivery
     * @name Create
     * @summary Register physical delivery request
     * @request POST:/api/v1/physical-deliveries
     */
    create: (data: PhysicalDeliveryCreateDto, params: RequestParams = {}) =>
      this.request<PhysicalDeliveryResponseDto, any>({
        path: `/api/v1/physical-deliveries`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name GetTrades
     * @summary Get Trades
     * @request POST:/api/v1/orders/trades
     */
    getTrades: (data: TradeFilter, params: RequestParams = {}) =>
      this.request<PagedTradeResponse, any>({
        path: `/api/v1/orders/trades`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name GetCurrentOrders
     * @summary Get Orders
     * @request POST:/api/v1/orders/orders
     */
    getCurrentOrders: (data: OrderFilter, params: RequestParams = {}) =>
      this.request<PagedOrderResponse, any>({
        path: `/api/v1/orders/orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name PlaceCashSellOrder
     * @summary Place cash sell order
     * @request POST:/api/v1/orders/cash/sell
     */
    placeCashSellOrder: (
      data: ExchangeRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseOrderDto, any>({
        path: `/api/v1/orders/cash/sell`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name PlaceCashBuyOrder
     * @summary Place cash buy order
     * @request POST:/api/v1/orders/cash/buy
     */
    placeCashBuyOrder: (data: ExchangeRequestDto, params: RequestParams = {}) =>
      this.request<ApiResponseOrderDto, any>({
        path: `/api/v1/orders/cash/buy`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Investment
     * @name CreateNewInvestment
     * @summary Create new Investment
     * @request POST:/api/v1/investment
     */
    createNewInvestment: (
      data: InvestmentRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/investment`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biometric Authentication
     * @name StartBiometricRegistration
     * @summary Start biometric registration
     * @request POST:/api/v1/biometric/biometric/register/start
     */
    startBiometricRegistration: (
      data: BiometricRegistrationRequest,
      params: RequestParams = {},
    ) =>
      this.request<BiometricRegistrationResponse, any>({
        path: `/api/v1/biometric/biometric/register/start`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biometric Authentication
     * @name CompleteBiometricRegistration
     * @summary Complete biometric registration
     * @request POST:/api/v1/biometric/biometric/register/complete
     */
    completeBiometricRegistration: (
      data: BiometricRegistrationCompleteRequest,
      params: RequestParams = {},
    ) =>
      this.request<StandardResponse, any>({
        path: `/api/v1/biometric/biometric/register/complete`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetWallets1
     * @summary Get Wallets
     * @request POST:/api/v1/admin/wallets
     */
    getWallets1: (
      data: FinancialAccountFilterDto,
      params: RequestParams = {},
    ) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name WalletWithdrawal
     * @summary Wallet Withdrawal
     * @request POST:/api/v1/admin/wallet/withdrawal
     */
    walletWithdrawal: (
      data: WithdrawalAccountRequest,
      params: RequestParams = {},
    ) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/admin/wallet/withdrawal`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name TreasuryWallets
     * @summary Treasury Wallets
     * @request POST:/api/v1/admin/wallet/treasury
     */
    treasuryWallets: (params: RequestParams = {}) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallet/treasury`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name WalletTransfer
     * @summary Wallet Transfer
     * @request POST:/api/v1/admin/wallet/transfer
     */
    walletTransfer: (data: TransferRequestDto, params: RequestParams = {}) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/admin/wallet/transfer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name WalletChangeStatus
     * @summary Change Wallet status
     * @request POST:/api/v1/admin/wallet/status/change
     */
    walletChangeStatus: (
      data: AccountChangeStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/wallet/status/change`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name WalletDeposit
     * @summary Wallet Deposit
     * @request POST:/api/v1/admin/wallet/deposit
     */
    walletDeposit: (data: DepositRequestDto, params: RequestParams = {}) =>
      this.request<TransferResponseDto, any>({
        path: `/api/v1/admin/wallet/deposit`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetUsers
     * @summary Get users
     * @request POST:/api/v1/admin/users
     */
    getUsers: (data: UserAccountFilter, params: RequestParams = {}) =>
      this.request<PageUserAccount, any>({
        path: `/api/v1/admin/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name ChangeUserStatus
     * @summary Get users
     * @request POST:/api/v1/admin/user/{userId}/status
     */
    changeUserStatus: (
      userId: number,
      data: UserChangeStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/user/${userId}/status`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetUserWallets
     * @summary Get user wallets
     * @request POST:/api/v1/admin/user/wallets
     */
    getUserWallets: (data: UserAccountFilter, params: RequestParams = {}) =>
      this.request<UserWalletDto[], any>({
        path: `/api/v1/admin/user/wallets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetUserWalletByUserId
     * @summary Get user wallet by userId
     * @request POST:/api/v1/admin/user/wallet/{userId}
     */
    getUserWalletByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<UserWalletDto, any>({
        path: `/api/v1/admin/user/wallet/${userId}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetTrades1
     * @summary Get Trades
     * @request POST:/api/v1/admin/trades
     */
    getTrades1: (data: TradeFilter, params: RequestParams = {}) =>
      this.request<PagedTradeResponse, any>({
        path: `/api/v1/admin/trades`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetTotalWallets
     * @summary Get total Wallets
     * @request POST:/api/v1/admin/total/wallets
     */
    getTotalWallets: (
      data: FinancialAccountFilterDto,
      params: RequestParams = {},
    ) =>
      this.request<TotalFinancialAccountResponseDto, any>({
        path: `/api/v1/admin/total/wallets`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves all entities from the system
     *
     * @tags Product Resource
     * @name GetAll
     * @summary Get all entities
     * @request GET:/api/v1/admin/product
     */
    getAll: (params: RequestParams = {}) =>
      this.request<Product[], Product[]>({
        path: `/api/v1/admin/product`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new entity in the system
     *
     * @tags Product Resource
     * @name Create1
     * @summary Create a new entity
     * @request POST:/api/v1/admin/product
     */
    create1: (data: Product, params: RequestParams = {}) =>
      this.request<Product, Product>({
        path: `/api/v1/admin/product`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetOrders
     * @summary Get Orders
     * @request POST:/api/v1/admin/orders
     */
    getOrders: (data: OrderFilter, params: RequestParams = {}) =>
      this.request<PagedOrderResponse, any>({
        path: `/api/v1/admin/orders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves all entities from the system
     *
     * @tags Investment Resource
     * @name GetAll1
     * @summary Get all entities
     * @request GET:/api/v1/admin/investment
     */
    getAll1: (params: RequestParams = {}) =>
      this.request<InvestmentPlan[], InvestmentPlan[]>({
        path: `/api/v1/admin/investment`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new entity in the system
     *
     * @tags Investment Resource
     * @name Create2
     * @summary Create a new entity
     * @request POST:/api/v1/admin/investment
     */
    create2: (data: InvestmentPlan, params: RequestParams = {}) =>
      this.request<InvestmentPlan, InvestmentPlan>({
        path: `/api/v1/admin/investment`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Initialize Application
     * @name InitApplication
     * @request POST:/api/v1/admin/init
     */
    initApplication: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/admin/init`,
        method: "POST",
        ...params,
      }),

    /**
     * @description Retrieves all entities from the system
     *
     * @tags FAQ Resource
     * @name GetAll2
     * @summary Get all entities
     * @request GET:/api/v1/admin/faq
     */
    getAll2: (params: RequestParams = {}) =>
      this.request<Faq[], Faq[]>({
        path: `/api/v1/admin/faq`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new entity in the system
     *
     * @tags FAQ Resource
     * @name Create3
     * @summary Create a new entity
     * @request POST:/api/v1/admin/faq
     */
    create3: (data: Faq, params: RequestParams = {}) =>
      this.request<Faq, Faq>({
        path: `/api/v1/admin/faq`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetCashouts
     * @summary Cashouts List
     * @request POST:/api/v1/admin/cashouts
     */
    getCashouts: (data: CashoutFilterDto, params: RequestParams = {}) =>
      this.request<CashoutDto[], any>({
        path: `/api/v1/admin/cashouts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name CashoutsChangeStatus
     * @summary Change Cashout status
     * @request POST:/api/v1/admin/cashout/status
     */
    cashoutsChangeStatus: (
      data: CashoutChangeStatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/admin/cashout/status`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieves all entities from the system
     *
     * @tags Application Config Resource
     * @name GetAll3
     * @summary Get all entities
     * @request GET:/api/v1/admin/application/config
     */
    getAll3: (params: RequestParams = {}) =>
      this.request<ApplicationConfig[], ApplicationConfig[]>({
        path: `/api/v1/admin/application/config`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Creates a new entity in the system
     *
     * @tags Application Config Resource
     * @name Create4
     * @summary Create a new entity
     * @request POST:/api/v1/admin/application/config
     */
    create4: (data: ApplicationConfig, params: RequestParams = {}) =>
      this.request<ApplicationConfig, ApplicationConfig>({
        path: `/api/v1/admin/application/config`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name InvestmentAccounts
     * @summary Investment Accounts
     * @request POST:/api/v1/admin/account/investments
     */
    investmentAccounts: (params: RequestParams = {}) =>
      this.request<InvestmentAccountDto[], any>({
        path: `/api/v1/admin/account/investments`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name InvestmentAccountsByUserId
     * @summary Investment Accounts by user ID
     * @request POST:/api/v1/admin/account/investment/{userId}
     */
    investmentAccountsByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<InvestmentAccountDto[], any>({
        path: `/api/v1/admin/account/investment/${userId}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name LogoutAllDevices
     * @summary Logout from all devices
     * @request POST:/api/v1/account/sessions/logout-all
     */
    logoutAllDevices: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/sessions/logout-all`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name ResetPassword
     * @summary Reset password
     * @request POST:/api/v1/account/reset-password
     */
    resetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UploadAvatar
     * @summary Upload profile avatar
     * @request POST:/api/v1/account/profile/avatar
     */
    uploadAvatar: (
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<AvatarUploadResponseDto, any>({
        path: `/api/v1/account/profile/avatar`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name MarkNotificationAsRead
     * @summary Mark notification as read
     * @request POST:/api/v1/account/notifications/{id}/read
     */
    markNotificationAsRead: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/notifications/${id}/read`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name MarkAllNotificationsAsRead
     * @summary Mark all notifications as read
     * @request POST:/api/v1/account/notifications/read-all
     */
    markAllNotificationsAsRead: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/notifications/read-all`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name VerifyMobile
     * @summary Verify mobile number
     * @request POST:/api/v1/account/kyc/verify/mobile
     */
    verifyMobile: (data: VerifyMobileDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/kyc/verify/mobile`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name VerifyEmail
     * @summary Verify email
     * @request POST:/api/v1/account/kyc/verify/email
     */
    verifyEmail: (data: VerifyEmailDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/kyc/verify/email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name UploadKycDocuments
     * @summary Upload KYC documents
     * @request POST:/api/v1/account/kyc/documents/upload
     */
    uploadKycDocuments: (
      query: {
        documentType: string;
      },
      data: {
        /** @format binary */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/kyc/documents/upload`,
        method: "POST",
        query: query,
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name ForgotPassword
     * @summary Forgot password
     * @request POST:/api/v1/account/forgot-password
     */
    forgotPassword: (data: ForgotPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name ChangePassword1
     * @request POST:/api/v1/account/changePassword
     */
    changePassword1: (
      data: ChangePasswordRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/changePassword`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AddToDefault
     * @request POST:/api/v1/account/bank/accounts/default
     */
    addToDefault: (
      data: AddRoDefaultBankAccountDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/bank/accounts/default`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AddBankAccount
     * @summary Add Bank Account
     * @request POST:/api/v1/account/bank/account/add
     */
    addBankAccount: (data: BankAccountDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/bank/account/add`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetApiKeys
     * @summary Get API keys
     * @request GET:/api/v1/account/api-keys
     */
    getApiKeys: (params: RequestParams = {}) =>
      this.request<ApiKeyDto[], any>({
        path: `/api/v1/account/api-keys`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name CreateApiKey
     * @summary Create new API key
     * @request POST:/api/v1/account/api-keys
     */
    createApiKey: (data: CreateApiKeyDto, params: RequestParams = {}) =>
      this.request<ApiKeyCreateResponse, any>({
        path: `/api/v1/account/api-keys`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name EnableApiKey
     * @summary Enable API key
     * @request POST:/api/v1/account/api-keys/{id}/enable
     */
    enableApiKey: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/api-keys/${id}/enable`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name DisableApiKey
     * @summary Disable API key
     * @request POST:/api/v1/account/api-keys/{id}/disable
     */
    disableApiKey: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/api-keys/${id}/disable`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetWithdrawalAddresses
     * @summary Get withdrawal addresses
     * @request GET:/api/v1/account/addresses
     */
    getWithdrawalAddresses: (params: RequestParams = {}) =>
      this.request<UserAddressDto[], any>({
        path: `/api/v1/account/addresses`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AddWithdrawalAddress
     * @summary Add address
     * @request POST:/api/v1/account/addresses
     */
    addWithdrawalAddress: (
      data: CreateUserAddressDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/addresses`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name Verify2Fa
     * @summary Verify and enable 2FA
     * @request POST:/api/v1/account/2fa/verify
     */
    verify2Fa: (data: VerifyTwoFactorDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/2fa/verify`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name Enable2Fa
     * @summary Enable 2FA
     * @request POST:/api/v1/account/2fa/enable
     */
    enable2Fa: (params: RequestParams = {}) =>
      this.request<TwoFactorSetupDto, any>({
        path: `/api/v1/account/2fa/enable`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name Disable2Fa
     * @summary Disable 2FA
     * @request POST:/api/v1/account/2fa/disable
     */
    disable2Fa: (data: DisableTwoFactorDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/2fa/disable`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Margin Trading
     * @name ClosePosition
     * @summary Close a margin position
     * @request POST:/api/margin/position/close
     */
    closePosition: (
      data: PositionCloseRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<PositionCloseResponse, any>({
        path: `/api/margin/position/close`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Margin Trading
     * @name PlaceMarginOrder
     * @summary Place a margin order
     * @request POST:/api/margin/order
     */
    placeMarginOrder: (data: MarginOrderRequest, params: RequestParams = {}) =>
      this.request<MarginOrderResponse, any>({
        path: `/api/margin/order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Margin Trading
     * @name PlaceMarginOrderByRequiredMargin
     * @summary Place a margin order by required margin
     * @request POST:/api/margin/order/required/margin
     */
    placeMarginOrderByRequiredMargin: (
      data: MarginOrderRequest,
      params: RequestParams = {},
    ) =>
      this.request<MarginOrderResponse, any>({
        path: `/api/margin/order/required/margin`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Kyc
     * @name VerifyOtpCode
     * @summary Verify Otp code
     * @request POST:/api/kyc/verify/otp
     */
    verifyOtpCode: (data: VerifyCodeDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/kyc/verify/otp`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Kyc
     * @name SendOtpCode
     * @summary Send Otp code
     * @request POST:/api/kyc/send/otp/{phoneNumber}
     */
    sendOtpCode: (phoneNumber: string, params: RequestParams = {}) =>
      this.request<OtpResponse, any>({
        path: `/api/kyc/send/otp/${phoneNumber}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Kyc
     * @name Register
     * @summary Calculate funding charge
     * @request POST:/api/kyc/register
     */
    register: (data: RegisterUserRequestDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/kyc/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetWalletTransactionDetail
     * @summary Get wallet transaction detail
     * @request GET:/api/v1/wallet/transaction/{id}
     */
    getWalletTransactionDetail: (id: number, params: RequestParams = {}) =>
      this.request<AccountTransactionsDto, any>({
        path: `/api/v1/wallet/transaction/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetMarginWalletBalance
     * @summary Create margin wallet
     * @request GET:/api/v1/wallet/margin/{asset}
     */
    getMarginWalletBalance: (asset: string, params: RequestParams = {}) =>
      this.request<AccountBalanceResponse, any>({
        path: `/api/v1/wallet/margin/${asset}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetMainWalletTransactions
     * @summary Get main wallet transaction paged
     * @request GET:/api/v1/wallet/main/transactions/{from}/{size}
     */
    getMainWalletTransactions: (
      from: number,
      size: number,
      params: RequestParams = {},
    ) =>
      this.request<AccountTransactionsPaged, any>({
        path: `/api/v1/wallet/main/transactions/${from}/${size}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetMainWalletBalance
     * @summary Get main wallet balance
     * @request GET:/api/v1/wallet/main/balance/{asset}
     */
    getMainWalletBalance: (
      asset:
        | "GOLD"
        | "USDT"
        | "IRR"
        | "BTC"
        | "ETH"
        | "GOLD_18"
        | "GOLD_24"
        | "COPPER"
        | "GOLD_FORWARD_2"
        | "GOLD_FORWARD_1"
        | "SILVER"
        | "TMN",
      params: RequestParams = {},
    ) =>
      this.request<AccountBalanceResponse, any>({
        path: `/api/v1/wallet/main/balance/${asset}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallet
     * @name GetPartyWallets
     * @summary Get wallets
     * @request GET:/api/v1/wallet/list
     */
    getPartyWallets: (params: RequestParams = {}) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/wallet/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Pricing
     * @name GetMarketPrice
     * @summary Get market price
     * @request GET:/api/v1/pricing/market/{assetCode}
     */
    getMarketPrice: (assetCode: string, params: RequestParams = {}) =>
      this.request<ApiResponseBigDecimal, any>({
        path: `/api/v1/pricing/market/${assetCode}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Physical Delivery
     * @name GetById
     * @summary Get physical delivery by id
     * @request GET:/api/v1/physical-deliveries/{id}
     */
    getById: (id: number, params: RequestParams = {}) =>
      this.request<PhysicalDeliveryResponseDto, any>({
        path: `/api/v1/physical-deliveries/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Physical Delivery
     * @name MyRequests
     * @summary Get my delivery requests
     * @request GET:/api/v1/physical-deliveries/my
     */
    myRequests: (params: RequestParams = {}) =>
      this.request<PhysicalDeliveryResponseDto[], any>({
        path: `/api/v1/physical-deliveries/my`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Investment
     * @name GetInvestmentPlans
     * @summary Get Investment plans
     * @request GET:/api/v1/investment/plans
     */
    getInvestmentPlans: (params: RequestParams = {}) =>
      this.request<InvestmentPlanDto[], any>({
        path: `/api/v1/investment/plans`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Investment
     * @name GetInvestmentAccounts
     * @summary Get Investment accounts
     * @request GET:/api/v1/investment/accounts
     */
    getInvestmentAccounts: (params: RequestParams = {}) =>
      this.request<InvestmentAccountDto[], any>({
        path: `/api/v1/investment/accounts`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biometric Authentication
     * @name GetUserBiometricDevices
     * @summary Get user's biometric devices
     * @request GET:/api/v1/biometric/biometric/devices
     */
    getUserBiometricDevices: (params: RequestParams = {}) =>
      this.request<BiometricCredentialDto[], any>({
        path: `/api/v1/biometric/biometric/devices`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Asset
     * @name GetAssets
     * @summary Get Assets
     * @request GET:/api/v1/asset
     */
    getAssets: (params: RequestParams = {}) =>
      this.request<AssetTypeDto[], any>({
        path: `/api/v1/asset`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetWalletsPreUsers
     * @summary Get Wallets pre user
     * @request GET:/api/v1/admin/wallets/{userId}
     */
    getWalletsPreUsers: (userId: number, params: RequestParams = {}) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallets/${userId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetMarginWallets
     * @summary Get margin wallets
     * @request GET:/api/v1/admin/wallets/margin/{from}/{size}
     */
    getMarginWallets: (
      from: number,
      size: number,
      params: RequestParams = {},
    ) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallets/margin/${from}/${size}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetCreditWallets
     * @summary Get credit wallets
     * @request GET:/api/v1/admin/wallets/credit/{from}/{size}
     */
    getCreditWallets: (
      from: number,
      size: number,
      params: RequestParams = {},
    ) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallets/credit/${from}/${size}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetBasketAccounts
     * @summary Get Basket Accounts
     * @request GET:/api/v1/admin/wallet/baskets
     */
    getBasketAccounts: (params: RequestParams = {}) =>
      this.request<FinancialAccountDto[], any>({
        path: `/api/v1/admin/wallet/baskets`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name UserShowcase
     * @summary User showcase
     * @request GET:/api/v1/admin/user/showcase
     */
    userShowcase: (params: RequestParams = {}) =>
      this.request<UserAccountShowcase, any>({
        path: `/api/v1/admin/user/showcase`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetUserCategories
     * @summary Get user categories
     * @request GET:/api/v1/admin/user/categories
     */
    getUserCategories: (params: RequestParams = {}) =>
      this.request<UserCategoryDto[], any>({
        path: `/api/v1/admin/user/categories`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetTodayTradesSummary
     * @summary Today trade
     * @request GET:/api/v1/admin/today/trade
     */
    getTodayTradesSummary: (params: RequestParams = {}) =>
      this.request<TradeSummaryByCurrencyDto[], any>({
        path: `/api/v1/admin/today/trade`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name Showcase
     * @summary Showcase
     * @request GET:/api/v1/admin/showcase
     */
    showcase: (params: RequestParams = {}) =>
      this.request<ShowcaseDto, any>({
        path: `/api/v1/admin/showcase`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if an entity exists by its ID
     *
     * @tags Product Resource
     * @name ExistsById
     * @summary Check entity existence
     * @request GET:/api/v1/admin/product/{id}/exists
     */
    existsById: (id: number, params: RequestParams = {}) =>
      this.request<boolean, boolean>({
        path: `/api/v1/admin/product/${id}/exists`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name GetMe
     * @summary Get me
     * @request GET:/api/v1/admin/me
     */
    getMe: (params: RequestParams = {}) =>
      this.request<UserAccountDto, any>({
        path: `/api/v1/admin/me`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if an entity exists by its ID
     *
     * @tags Investment Resource
     * @name ExistsById1
     * @summary Check entity existence
     * @request GET:/api/v1/admin/investment/{id}/exists
     */
    existsById1: (id: number, params: RequestParams = {}) =>
      this.request<boolean, boolean>({
        path: `/api/v1/admin/investment/${id}/exists`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if an entity exists by its ID
     *
     * @tags FAQ Resource
     * @name ExistsById2
     * @summary Check entity existence
     * @request GET:/api/v1/admin/faq/{id}/exists
     */
    existsById2: (id: number, params: RequestParams = {}) =>
      this.request<boolean, boolean>({
        path: `/api/v1/admin/faq/${id}/exists`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Admin
     * @name DeliverRequests
     * @summary Get all delivery requests
     * @request GET:/api/v1/admin/delivers
     */
    deliverRequests: (params: RequestParams = {}) =>
      this.request<PhysicalDeliveryResponseDto[], any>({
        path: `/api/v1/admin/delivers`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Checks if an entity exists by its ID
     *
     * @tags Application Config Resource
     * @name ExistsById3
     * @summary Check entity existence
     * @request GET:/api/v1/admin/application/config/{id}/exists
     */
    existsById3: (id: number, params: RequestParams = {}) =>
      this.request<boolean, boolean>({
        path: `/api/v1/admin/application/config/${id}/exists`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name VerifyResetToken
     * @summary Verify reset token
     * @request GET:/api/v1/account/verify-reset-token
     */
    verifyResetToken: (
      query: {
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<boolean, any>({
        path: `/api/v1/account/verify-reset-token`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetCurrentUsage
     * @summary Get current usage
     * @request GET:/api/v1/account/usage
     */
    getCurrentUsage: (params: RequestParams = {}) =>
      this.request<UsageDto, any>({
        path: `/api/v1/account/usage`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetTradingSummary
     * @summary Get trading summary
     * @request GET:/api/v1/account/trading/summary
     */
    getTradingSummary: (params: RequestParams = {}) =>
      this.request<TradingSummaryDto, any>({
        path: `/api/v1/account/trading/summary`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetUserTiers
     * @summary Get user tiers
     * @request GET:/api/v1/account/tiers
     */
    getUserTiers: (params: RequestParams = {}) =>
      this.request<UserTierDto[], any>({
        path: `/api/v1/account/tiers`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetUserStatistics
     * @summary Get user statistics
     * @request GET:/api/v1/account/statistics
     */
    getUserStatistics: (params: RequestParams = {}) =>
      this.request<UserStatisticsDto, any>({
        path: `/api/v1/account/statistics`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetActiveSessions
     * @summary Get active sessions
     * @request GET:/api/v1/account/sessions
     */
    getActiveSessions: (params: RequestParams = {}) =>
      this.request<UserSessionDto[], any>({
        path: `/api/v1/account/sessions`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetReferralStats
     * @summary Get referral statistics
     * @request GET:/api/v1/account/referral/stats
     */
    getReferralStats: (params: RequestParams = {}) =>
      this.request<ReferralStatsDto, any>({
        path: `/api/v1/account/referral/stats`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetSecurityStatus
     * @summary Get security status
     * @request GET:/api/v1/account/profile/security
     */
    getSecurityStatus: (params: RequestParams = {}) =>
      this.request<SecurityStatusDto, any>({
        path: `/api/v1/account/profile/security`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetPortfolioWalletSummary
     * @summary Get portfolio Wallet summary
     * @request GET:/api/v1/account/portfolio/wallet/summary
     */
    getPortfolioWalletSummary: (params: RequestParams = {}) =>
      this.request<PortfolioWalletSummaryDto, any>({
        path: `/api/v1/account/portfolio/wallet/summary`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetPortfolioSummary
     * @summary Get portfolio summary
     * @request GET:/api/v1/account/portfolio/summary
     */
    getPortfolioSummary: (params: RequestParams = {}) =>
      this.request<PortfolioSummaryDto, any>({
        path: `/api/v1/account/portfolio/summary`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetPortfolioMarketSummary
     * @summary Get portfolio Market summary
     * @request GET:/api/v1/account/portfolio/market/summary/{walletTypeCode}
     */
    getPortfolioMarketSummary: (
      walletTypeCode: string,
      params: RequestParams = {},
    ) =>
      this.request<PortfolioMarketSummaryDto, any>({
        path: `/api/v1/account/portfolio/market/summary/${walletTypeCode}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetNotifications
     * @summary Get notifications
     * @request GET:/api/v1/account/notifications
     */
    getNotifications: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
        /**
         * @format int32
         * @default 20
         */
        size?: number;
        unreadOnly?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<NotificationListResponse, any>({
        path: `/api/v1/account/notifications`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name LoginHistory
     * @request GET:/api/v1/account/login/history/{size}
     */
    loginHistory: (size: number, params: RequestParams = {}) =>
      this.request<LoginLog[], any>({
        path: `/api/v1/account/login/history/${size}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetUserLimits
     * @summary Get user limits
     * @request GET:/api/v1/account/limits
     */
    getUserLimits: (params: RequestParams = {}) =>
      this.request<UserLimitsDto, any>({
        path: `/api/v1/account/limits`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetKycStatus
     * @summary Get KYC status
     * @request GET:/api/v1/account/kyc/status
     */
    getKycStatus: (params: RequestParams = {}) =>
      this.request<KycStatusDto, any>({
        path: `/api/v1/account/kyc/status`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetKycLevels
     * @summary Get KYC levels
     * @request GET:/api/v1/account/kyc/levels
     */
    getKycLevels: (params: RequestParams = {}) =>
      this.request<KycLevelDto[], any>({
        path: `/api/v1/account/kyc/levels`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetKycDocuments
     * @summary Get uploaded documents
     * @request GET:/api/v1/account/kyc/documents
     */
    getKycDocuments: (params: RequestParams = {}) =>
      this.request<KycDocumentDto[], any>({
        path: `/api/v1/account/kyc/documents`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetUserInfo
     * @summary Get userInfo
     * @request GET:/api/v1/account/info
     */
    getUserInfo: (params: RequestParams = {}) =>
      this.request<UserInfoDto, any>({
        path: `/api/v1/account/info`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name GetBankAccounts
     * @request GET:/api/v1/account/bank/accounts
     */
    getBankAccounts: (params: RequestParams = {}) =>
      this.request<BankAccountDto[], any>({
        path: `/api/v1/account/bank/accounts`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name Get2FaStatus
     * @summary Get 2FA status
     * @request GET:/api/v1/account/2fa/status
     */
    get2FaStatus: (params: RequestParams = {}) =>
      this.request<TwoFactorStatusDto, any>({
        path: `/api/v1/account/2fa/status`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags System
     * @name GetMarkets
     * @request GET:/api/system/markets
     */
    getMarkets: (params: RequestParams = {}) =>
      this.request<MarketDto[], any>({
        path: `/api/system/markets`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags System
     * @name GetFaqs
     * @request GET:/api/system/faqs
     */
    getFaqs: (params: RequestParams = {}) =>
      this.request<FaqDto[], any>({
        path: `/api/system/faqs`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Margin Trading
     * @name GetOpenPositions
     * @summary Get user's open positions
     * @request GET:/api/margin/positions/open
     */
    getOpenPositions: (params: RequestParams = {}) =>
      this.request<PositionDetailsResponse[], any>({
        path: `/api/margin/positions/open`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Margin Trading
     * @name GetPositionDetails
     * @summary Get position details
     * @request GET:/api/margin/position/{positionId}
     */
    getPositionDetails: (positionId: number, params: RequestParams = {}) =>
      this.request<PositionDetailsResponse, any>({
        path: `/api/margin/position/${positionId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Biometric Authentication
     * @name RemoveBiometricDevice
     * @summary Remove biometric device
     * @request DELETE:/api/v1/biometric/biometric/device/{credentialId}
     */
    removeBiometricDevice: (credentialId: number, params: RequestParams = {}) =>
      this.request<StandardResponse, any>({
        path: `/api/v1/biometric/biometric/device/${credentialId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name TerminateSession
     * @summary Terminate a specific session
     * @request DELETE:/api/v1/account/sessions/{sessionId}
     */
    terminateSession: (sessionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/sessions/${sessionId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name RemoveBankAccount
     * @request DELETE:/api/v1/account/bank/accounts/remove
     */
    removeBankAccount: (
      data: RemoveBankAccountDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/v1/account/bank/accounts/remove`,
        method: "DELETE",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name DeleteWithdrawalAddress
     * @summary Delete withdrawal address
     * @request DELETE:/api/v1/account/addresses/{id}
     */
    deleteWithdrawalAddress: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/v1/account/addresses/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  rest = {
    /**
     * No description
     *
     * @tags Security Resource API
     * @name SecurityVerifyOtpCode
     * @summary Verify Otp code
     * @request POST:/rest/security/verify/otp
     */
    securityVerifyOtpCode: (data: VerifyCodeDto, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/rest/security/verify/otp`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name SecuritySendOtpCode
     * @summary Send Otp code
     * @request POST:/rest/security/send/otp/{nationalCode}
     */
    securitySendOtpCode: (nationalCode: string, params: RequestParams = {}) =>
      this.request<OtpResponse, any>({
        path: `/rest/security/send/otp/${nationalCode}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name Logout
     * @request POST:/rest/security/logout
     */
    logout: (data: AuthenticationRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/rest/security/logout`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name Authenticate
     * @request POST:/rest/security/login/token
     */
    authenticate: (data: AuthenticationRequest, params: RequestParams = {}) =>
      this.request<AuthenticationResponse, any>({
        path: `/rest/security/login/token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name ChangePassword
     * @request POST:/rest/security/changePassword
     */
    changePassword: (data: ChangeAuthPasswordDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/rest/security/changePassword`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name BiometricLogin
     * @summary Login with biometric
     * @request POST:/rest/security/biometric/login
     */
    biometricLogin: (data: BiometricLoginRequest, params: RequestParams = {}) =>
      this.request<AuthenticationResponse, any>({
        path: `/rest/security/biometric/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Security Resource API
     * @name CheckBiometricEnabled
     * @summary Check if user has active biometric device
     * @request POST:/rest/security/biometric/check-enabled
     */
    checkBiometricEnabled: (
      data: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, boolean>, any>({
        path: `/rest/security/biometric/check-enabled`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
