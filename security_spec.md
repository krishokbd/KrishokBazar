# Zero-Trust Firestore Security Specification

This document details the access control constraints and data validation rules for our live distributed Agriculture Marketplace.

## 1. Data Invariants & Security Principles

1.  **Strict Owner Bounds**: Users can only edit their own profile information (`/users/{userId}`). Farmers can only manage their own profile details inside `/farmers/{farmerId}`.
2.  **Product Integrity**: Only verified/approved farmers or Admins can initialize, list, or edit marketplace products under `/products/{productId}`. Farmers cannot modify products that belong to another farmer.
3.  **Audit Immutable Fields**: Properties such as `createdAt`, `id`, `farmerId`, or `customerId` must be marked as system IMMUTABLE and verified against the user's active session signature.
4.  **Order Privacy**: Order documents are highly sensitive containing personal address and phone data. Access must be strictly governed such that an Order is viewable or manageable solely by the Admin, the Customer who purchased it, or a Farmer whose products are contained in that order.
5.  **Withdrawal Rigor**: Farmers cannot self-approve payout states. Only Admins can transition withdrawal requests to status `"Approved"`, `"Paid"`, or `"Rejected"`.

## 2. The "Dirty Dozen" Vulnerabilities Blocked

A set of adversarial payloads designed to compromise the system, which our rules must mathematically prevent (returning `PERMISSION_DENIED`):

1.  **Identity Spoofing in Product Creation**: A farmer creates a product setting the `farmerId` property to a different, high-rated farmer to piggyback on their rating.
2.  **Malicious Pricing Hack**: A customer attempts to update a product description, raising the price or dropping the price to `1` BDT.
3.  **Self-Ledger Inflation**: A farmer modifies their own `balance` field in their `/farmers/{farmerId}` document to inject 1,000,500 BDT.
4.  **Arbitrary Order Snooping**: Authenticated customer A attempts to read/snoop the delivery address of customer B's order.
5.  **Unprivileged Withdrawal Approval**: A farmer updates their withdrawal request, changing the status from `"Pending"` to `"Paid"` manually.
6.  **Admin Bypass Spoof**: A customer attempts to register their role as `"Admin"`.
7.  **Spam Reviews Placement**: A user writes a comment targeting a non-existent product or spoofing the reviewer profile.
8.  **Denial of Wallet (Huge String Storage)**: A user uploads a product name containing 5MB of junk characters.
9.  **Bypassing Field Controls (Ghost Fields)**: Sending an update payload on a user document containing unmapped attributes like `isWhitelisted: true`.
10. **Pre-emptive Order Confirmation**: A normal customer trying to change an order status directly to `"Delivered"` before dispatch.
11. **Double Payout Withdrawal Refund**: A farmer attempting to reset a withdrawal status back to `"Rejected"` to force double refunds.
12. **NID Spoofing**: A user uploading custom verification status ratings directly through their profile update.

## 3. Test Runner Invariant Validation Rules

We write `firestore.rules` enforcing absolute validation, checking that all these constraints are met.
