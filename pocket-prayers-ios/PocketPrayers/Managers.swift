// Managers.swift
// State management for Pocket Prayers

import Foundation
import SwiftUI

// MARK: - Auth Manager
@MainActor
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var isLoading = false
    @Published var error: String?
    
    private let apiClient = APIClient.shared
    private let defaults = UserDefaults.standard
    
    init() {
        // Check for stored auth token
        if let token = defaults.string(forKey: "authToken"),
           let userData = defaults.data(forKey: "userData"),
           let user = try? JSONDecoder().decode(User.self, from: userData) {
            self.isAuthenticated = true
            self.currentUser = user
        }
    }
    
    func signIn(email: String, password: String) async {
        isLoading = true
        error = nil
        
        do {
            let response = try await apiClient.login(email: email, password: password)
            defaults.set(response.token, forKey: "authToken")
            defaults.set(try JSONEncoder().encode(response.user), forKey: "userData")
            currentUser = response.user
            isAuthenticated = true
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func register(email: String, password: String, displayName: String?) async {
        isLoading = true
        error = nil
        
        do {
            let response = try await apiClient.register(email: email, password: password, displayName: displayName)
            defaults.set(response.token, forKey: "authToken")
            defaults.set(try JSONEncoder().encode(response.user), forKey: "userData")
            currentUser = response.user
            isAuthenticated = true
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func signOut() {
        defaults.removeObject(forKey: "authToken")
        defaults.removeObject(forKey: "userData")
        isAuthenticated = false
        currentUser = nil
    }
}

// MARK: - Prayer Manager
@MainActor
class PrayerManager: ObservableObject {
    @Published var prayers: [Prayer] = []
    @Published var isLoading = false
    @Published var hasMore = true
    @Published var error: String?
    
    private var cursor: String?
    private let apiClient = APIClient.shared
    
    func loadPrayers(refresh: Bool = false) async {
        guard !isLoading else { return }
        
        if refresh {
            prayers = []
            cursor = nil
            hasMore = true
        }
        
        isLoading = true
        error = nil
        
        do {
            let response = try await apiClient.getPrayers(limit: 20, cursor: cursor)
            prayers.append(contentsOf: response.prayers)
            hasMore = response.hasMore
            cursor = response.nextCursor
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func postPrayer(content: String, isAnonymous: Bool) async {
        isLoading = true
        error = nil
        
        do {
            let newPrayer = try await apiClient.postPrayer(content: content, isAnonymous: isAnonymous)
            prayers.insert(newPrayer, at: 0)
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func prayForPrayer(_ prayer: Prayer) async {
        guard let index = prayers.firstIndex(where: { $0.id == prayer.id }) else { return }
        
        do {
            let updatedPrayer = try await apiClient.prayForPrayer(id: prayer.id)
            prayers[index] = updatedPrayer
        } catch {
            // Handle error silently for now
        }
    }
}

// MARK: - Teachings Manager
@MainActor
class TeachingsManager: ObservableObject {
    @Published var teachings: [Teaching] = []
    @Published var isLoading = false
    @Published var error: String?
    
    private let apiClient = APIClient.shared
    
    func loadTeachings() async {
        guard !isLoading else { return }
        
        isLoading = true
        error = nil
        
        do {
            let response = try await apiClient.getTeachings()
            teachings = response.teachings.sorted { $0.createdAt > $1.createdAt }
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
}

// MARK: - Subscription Manager
@MainActor
class SubscriptionManager: ObservableObject {
    @Published var isSubscribed = false
    @Published var expiresAt: Date?
    @Published var isLoading = false
    
    private let apiClient = APIClient.shared
    
    func checkStatus() async {
        isLoading = true
        
        do {
            let status = try await apiClient.getSubscriptionStatus()
            isSubscribed = status.isPremium
            expiresAt = status.expiresAt
        } catch {
            // Handle error silently
        }
        
        isLoading = false
    }
    
    func subscribe() async {
        isLoading = true
        
        do {
            let checkout = try await apiClient.createSubscription()
            // Open checkout URL in Safari
            await UIApplication.shared.open(checkout.checkoutUrl)
        } catch {
            // Handle error
        }
        
        isLoading = false
    }
}
