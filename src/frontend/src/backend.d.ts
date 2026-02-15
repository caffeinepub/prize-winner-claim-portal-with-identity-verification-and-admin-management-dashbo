import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Testimonial {
    title: string;
    name: string;
    quote: string;
    income: string;
    image: ExternalBlob;
}
export type PayoutMethod = {
    __kind__: "atmCard";
    atmCard: {
        cardType: string;
        bank: string;
        cardNumber: string;
    };
} | {
    __kind__: "certifiedCheck";
    certifiedCheck: {
        bank: string;
        payeeName: string;
    };
} | {
    __kind__: "bankTransfer";
    bankTransfer: {
        bank: string;
        routingNumber: string;
        accountName: string;
        accountNumber: string;
    };
};
export interface PaginationParams {
    page: bigint;
    pageSize: bigint;
}
export type Time = bigint;
export interface WinningEntry {
    id: string;
    prizeNumber: string;
    name: string;
    isClaimed: boolean;
    ticketNumber: string;
    claimedBy?: Principal;
    claimTimestamp?: Time;
}
export interface WinnerClaim {
    id: string;
    status: ClaimStatus;
    payoutMethod: PayoutMethod;
    claimant: Principal;
    winnerId: string;
    submissionTimestamp: Time;
    idCardImageId?: string;
    selfieImageId?: string;
    adminResponse?: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum ClaimStatus {
    pending = "pending",
    approved = "approved",
    awaitingInfo = "awaitingInfo",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addTestimonial(testimonial: Testimonial): Promise<void>;
    adminResponse(claimId: string, response: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    claimWinningEntry(id: string): Promise<void>;
    getAllClaims(status: ClaimStatus | null, pagination: PaginationParams): Promise<Array<WinnerClaim>>;
    getAllWinningEntries(): Promise<Array<WinningEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEntryByNumber(prizeNumber: string): Promise<WinningEntry | null>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeTestimonial(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitWinnerClaim(claim: WinnerClaim): Promise<void>;
    updateClaimStatus(claimId: string, status: ClaimStatus): Promise<void>;
}
