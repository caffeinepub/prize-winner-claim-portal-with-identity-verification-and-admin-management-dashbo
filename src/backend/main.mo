import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  // Component setup authoriziation
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ---------------- Types ----------------
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  public type WinningEntry = {
    id : Text;
    prizeNumber : Text;
    ticketNumber : Text;
    name : Text;
    isClaimed : Bool;
    claimTimestamp : ?Time.Time;
    claimedBy : ?Principal;
  };

  public type PayoutMethod = {
    #atmCard : {
      bank : Text;
      cardType : Text;
      cardNumber : Text;
    };
    #certifiedCheck : {
      payeeName : Text;
      bank : Text;
    };
    #bankTransfer : {
      accountName : Text;
      accountNumber : Text;
      bank : Text;
      routingNumber : Text;
    };
  };

  public type ClaimStatus = {
    #pending;
    #awaitingInfo;
    #approved;
    #rejected;
  };

  public type WinnerClaim = {
    id : Text;
    winnerId : Text;
    claimant : Principal;
    payoutMethod : PayoutMethod;
    status : ClaimStatus;
    adminResponse : ?Text;
    submissionTimestamp : Time.Time;
    selfieImageId : ?Text;
    idCardImageId : ?Text;
  };

  public type PaginationParams = {
    page : Nat;
    pageSize : Nat;
  };

  public type Testimonial = {
    name : Text;
    title : Text;
    quote : Text;
    income : Text;
    image : Storage.ExternalBlob;
  };

  // ---------------- Storage ----------------
  let userProfiles = Map.empty<Principal, UserProfile>();
  let winningEntries = Map.empty<Text, WinningEntry>();
  let winnerClaims = Map.empty<Text, WinnerClaim>();
  let testimonials = Map.empty<Text, Testimonial>();

  // -------------- User Profile API --------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // -------------- Winning Entry API --------------
  module WinningEntry {
    public func compare(entry1 : WinningEntry, entry2 : WinningEntry) : Order.Order {
      Text.compare(entry1.id, entry2.id);
    };
  };

  public query ({ caller }) func getAllWinningEntries() : async [WinningEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view winning entries");
    };
    winningEntries.values().toArray();
  };

  public shared ({ caller }) func claimWinningEntry(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can claim winning entries");
    };

    switch (winningEntries.get(id)) {
      case (null) {
        Runtime.trap("Winning entry not found");
      };
      case (?entry) {
        if (entry.isClaimed) {
          Runtime.trap("Winning entry already claimed");
        };
        let updatedEntry = {
          id = entry.id;
          name = entry.name;
          prizeNumber = entry.prizeNumber;
          ticketNumber = entry.ticketNumber;
          isClaimed = true;
          claimTimestamp = ?Time.now();
          claimedBy = ?caller;
        };
        winningEntries.add(id, updatedEntry);
      };
    };
  };

  public query ({ caller }) func getEntryByNumber(prizeNumber : Text) : async ?WinningEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can search winning entries");
    };
    let iter = winningEntries.values().toArray().values();
    iter.find(
      func(entry) {
        entry.prizeNumber == prizeNumber;
      }
    );
  };

  // -------------- Winner Claim API --------------
  module WinnerClaim {
    public func compare(claim1 : WinnerClaim, claim2 : WinnerClaim) : Order.Order {
      Text.compare(claim1.id, claim2.id);
    };
  };

  public shared ({ caller }) func submitWinnerClaim(claim : WinnerClaim) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit claims");
    };

    // Verify the claim is submitted by the caller
    if (claim.claimant != caller) {
      Runtime.trap("Unauthorized: Cannot submit claim for another user");
    };

    winnerClaims.add(claim.id, claim);
  };

  public query ({ caller }) func getAllClaims(status : ?ClaimStatus, pagination : PaginationParams) : async [WinnerClaim] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all claims");
    };

    let allClaims = winnerClaims.values().toArray();
    let filteredClaims = switch (status) {
      case (null) { allClaims };
      case (?s) {
        let iter = allClaims.values();
        let list = List.empty<WinnerClaim>();
        iter.forEach(
          func(claim) {
            if (claim.status == s) { list.add(claim) };
          }
        );
        list.toArray();
      };
    };

    let start = pagination.page * pagination.pageSize;
    if (start >= filteredClaims.size()) { return [] };

    let end = start + pagination.pageSize;
    filteredClaims.sliceToArray(start, end);
  };

  public shared ({ caller }) func updateClaimStatus(claimId : Text, status : ClaimStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update claim status");
    };

    switch (winnerClaims.get(claimId)) {
      case (null) {
        Runtime.trap("Claim not found");
      };
      case (?claim) {
        let updatedClaim = {
          id = claim.id;
          winnerId = claim.winnerId;
          claimant = claim.claimant;
          payoutMethod = claim.payoutMethod;
          status = status;
          adminResponse = claim.adminResponse;
          submissionTimestamp = claim.submissionTimestamp;
          selfieImageId = claim.selfieImageId;
          idCardImageId = claim.idCardImageId;
        };
        winnerClaims.add(claimId, updatedClaim);
      };
    };
  };

  public shared ({ caller }) func adminResponse(claimId : Text, response : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can respond to claims");
    };

    switch (winnerClaims.get(claimId)) {
      case (null) {
        Runtime.trap("Claim not found");
      };
      case (?claim) {
        let updatedClaim = {
          id = claim.id;
          winnerId = claim.winnerId;
          claimant = claim.claimant;
          payoutMethod = claim.payoutMethod;
          status = claim.status;
          adminResponse = ?response;
          submissionTimestamp = claim.submissionTimestamp;
          selfieImageId = claim.selfieImageId;
          idCardImageId = claim.idCardImageId;
        };
        winnerClaims.add(claimId, updatedClaim);
      };
    };
  };

  // -------------- Testimonial API --------------
  module Testimonial {
    public func compare(testimonial1 : Testimonial, testimonial2 : Testimonial) : Order.Order {
      Text.compare(testimonial1.name, testimonial2.name);
    };
  };

  public query ({ caller = _ }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public shared ({ caller }) func addTestimonial(testimonial : Testimonial) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add testimonials");
    };
    testimonials.add(testimonial.name, testimonial);
  };

  public shared ({ caller }) func removeTestimonial(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove testimonials");
    };
    testimonials.remove(name);
  };
};
