// Services.swift
// API and backend services for Pocket Prayers

import Foundation

// MARK: - API Client
actor APIClient {
    static let shared = APIClient()
    
    // TODO: Replace with your actual backend URL
    private let baseURL = "https://api.pocketprayers.app"
    
    private func request<T: Codable>(_ endpoint: String, method: String = "GET", body: Data? = nil) async throws -> T {
        guard let url = URL(string: "\(baseURL)\(endpoint)") else {
            throw APIError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = UserDefaults.standard.string(forKey: "authToken") {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        if let body = body {
            request.httpBody = body
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }
    
    // MARK: - Auth endpoints
    func login(email: String, password: String) async throws -> AuthResponse {
        let body = try JSONEncoder().encode(["email": email, "password": password])
        return try await request("/auth/login", method: "POST", body: body)
    }
    
    func register(email: String, password: String, displayName: String?) async throws -> AuthResponse {
        var payload: [String: String] = ["email": email, "password": password]
        if let displayName = displayName {
            payload["displayName"] = displayName
        }
        let body = try JSONEncoder().encode(payload)
        return try await request("/auth/register", method: "POST", body: body)
    }
    
    // MARK: - Prayers endpoints
    func getPrayers(limit: Int = 20, cursor: String? = nil) async throws -> PrayerResponse {
        var endpoint = "/prayers?limit=\(limit)"
        if let cursor = cursor {
            endpoint += "&cursor=\(cursor)"
        }
        return try await request(endpoint)
    }
    
    func postPrayer(content: String, isAnonymous: Bool) async throws -> Prayer {
        let body = try JSONEncoder().encode(["content": content, "isAnonymous": isAnonymous])
        return try await request("/prayers", method: "POST", body: body)
    }
    
    func prayForPrayer(id: UUID) async throws -> Prayer {
        return try await request("/prayers/\(id.uuidString)/pray", method: "POST")
    }
    
    // MARK: - Teachings endpoints
    func getTeachings() async throws -> TeachingsResponse {
        return try await request("/teachings")
    }
    
    // MARK: - Subscription endpoints
    func getSubscriptionStatus() async throws -> SubscriptionStatus {
        return try await request("/subscription/status")
    }
    
    func createSubscription() async throws -> SubscriptionCheckout {
        return try await request("/subscription/create", method: "POST")
    }
}

// MARK: - Response Types
struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct SubscriptionStatus: Codable {
    let isPremium: Bool
    let expiresAt: Date?
}

struct SubscriptionCheckout: Codable {
    let checkoutUrl: URL
}

// MARK: - Errors
enum APIError: Error, LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(Int)
    case decodingError
    case unauthorized
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let code):
            return "HTTP error: \(code)"
        case .decodingError:
            return "Failed to parse response"
        case .unauthorized:
            return "Unauthorized - please sign in again"
        }
    }
}
