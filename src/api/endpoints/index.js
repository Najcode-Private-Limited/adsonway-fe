export const endpoints = {
  login: "api/auth/login",
  //admin
  allAdmin: "api/admin/get-admins",
  admin_register: "api/admin/create-admin",
  //agent
  allAgent: "api/admin/get-agents",
  agent_register: "api/admin/create-agent",
  //user
  allUser: "api/agent/get-associated-users",
  adminGetAllUsers: "api/admin/get-all-user",
  get_users_by_agent: "api/admin/get-users",
  user_register: "api/agent/create-user",
  // brands
  brands: "api/brand",
  // category
  category: "api/category",
  //sub-category
  subcategory: "api/sub-category",
  //admins
  admin: "api/auth/admin",
  //blogs
  blogs: "/api/blogs",
  // upload
  upload_file: "api/upload/upload-file",
  // profile
  update_profile: "api/admin/update-profile",
  update_agent_profile: "api/agent/update-profile",
  update_user_profile: "api/user/update-profile",
  // payment
  allPayment: "api/payment-method/get-all",
  createPayment: "api/payment-method/create-new-payment-method",
  deletePayment: "api/payment-method/delete-payment-method",
  getSinglePayment: "api/payment-method/get-single-method",
  updatePayment: "api/payment-method/update-payment-method",
  // wallet
  allWallet: "api/top-up-request/get-top-up-requests",
  getSingleWallet: "api/top-up-request/get-top-up-requests",
  createWallet: "api/top-up-request/add-top-up-request",
  deleteWallet: "api/top-up-request/delete-top-up-request",
  updateWallet: "api/top-up-request/update-top-up-request-status",
  getAllUserWallet: "api/top-up-request/get-user-top-up-requests",
  // transaction
  allTransactions: "api/wallet-ledger/get-all-transcation",
  myTransactions: "api/wallet-ledger/get-all-my-transaction",
  agentTransactions: "api/wallet-ledger/get-my-user-transcation",
  adAccounts: "api/admin/get-all-google-ad-applications",
  myAdApplications: "api/user/get-all-my-google-ad-applications",
  applyGoogleAd: "api/user/apply-google-ad",
  myWallet: "api/user/get-my-wallet",
  updateAdStatus: "api/admin/update-google-ad-application-status",
  facebookAdAccounts: "api/admin/get-all-facebook-ad-applications",
  updateFacebookAdStatus: "api/admin/update-facebook-ad-application-status",
  applyFacebookAd: "api/user/apply-facebook-ad",
  getFacebookSettings: "api/facebook-application-setting/get-setting",
  updateFacebookSettings: "api/facebook-application-setting/update-setting",
  myFacebookAdAccounts: "api/user/get-all-my-facebook-ad-applications",
  allFacebookAccounts: "api/admin/get-all-facebook-accounts",
  myFacebookAccounts: "api/user/get-all-my-facebook-accounts",
  createManualFacebookAccount: "api/admin/create-new-facebook-ad-account",
  allGoogleAccounts: "api/admin/get-all-google-accounts",
  myGoogleAccounts: "api/user/get-all-my-google-accounts",
  createManualGoogleAccount: "api/admin/create-new-google-ad-account",
  updateFacebookAdAccount: "api/admin/update-facebook-ad-account",
  updateGoogleAdAccount: "api/admin/update-google-ad-account",
  myFacebookAccountTopUpRequests: "api/user/get-all-my-facebook-account-topup-requests",
  myGoogleAccountTopUpRequests: "api/user/get-all-my-google-account-topup-requests",
  addMoneyToFacebookAccount: "api/user/add-money-to-facebook-account",
}