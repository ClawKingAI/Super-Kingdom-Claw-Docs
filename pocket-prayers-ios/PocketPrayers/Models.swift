// Models.swift
// Data models for Pocket Prayers

import Foundation

// MARK: - Prayer Model
struct Prayer: Identifiable, Codable, Sendable {
    let id: UUID
    let author: String
    let authorId: String?
    let content: String
    let timestamp: Date
    let prayersCount: Int
    let isAnonymous: Bool
    
    init(
        id: UUID = UUID(),
        author: String,
        authorId: String? = nil,
        content: String,
        timestamp: Date = Date(),
        prayersCount: Int = 0,
        isAnonymous: Bool = false
    ) {
        self.id = id
        self.author = author
        self.authorId = authorId
        self.content = content
        self.timestamp = timestamp
        self.prayersCount = prayersCount
        self.isAnonymous = isAnonymous
    }
}

// MARK: - Teaching Model
struct Teaching: Identifiable, Codable, Sendable {
    let id: UUID
    let title: String
    let description: String
    let videoUrl: String?
    let thumbnailUrl: String?
    let duration: Int // in seconds
    let createdAt: Date
    let isPremium: Bool
    
    init(
        id: UUID = UUID(),
        title: String,
        description: String,
        videoUrl: String? = nil,
        thumbnailUrl: String? = nil,
        duration: Int = 0,
        createdAt: Date = Date(),
        isPremium: Bool = true
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.videoUrl = videoUrl
        self.thumbnailUrl = thumbnailUrl
        self.duration = duration
        self.createdAt = createdAt
        self.isPremium = isPremium
    }
    
    var formattedDuration: String {
        let minutes = duration / 60
        let seconds = duration % 60
        return String(format: "%d:%02d", minutes, seconds)
    }
}

// MARK: - User Model
struct User: Identifiable, Codable, Sendable {
    let id: UUID
    let email: String
    let displayName: String?
    let createdAt: Date
    var isPremium: Bool
    var premiumExpiresAt: Date?
    
    init(
        id: UUID = UUID(),
        email: String,
        displayName: String? = nil,
        createdAt: Date = Date(),
        isPremium: Bool = false,
        premiumExpiresAt: Date? = nil
    ) {
        self.id = id
        self.email = email
        self.displayName = displayName
        self.createdAt = createdAt
        self.isPremium = isPremium
        self.premiumExpiresAt = premiumExpiresAt
    }
}

// MARK: - Subscription Tier
enum SubscriptionTier: String, Codable, Sendable {
    case free
    case premium
    case admin
    
    var price: String {
        switch self {
        case .free: return "Free"
        case .premium: return "$5/month"
        case .admin: return "Admin"
        }
    }
}

// MARK: - API Response Types
struct PrayerResponse: Codable {
    let prayers: [Prayer]
    let hasMore: Bool
    let nextCursor: String?
}

struct TeachingsResponse: Codable {
    let teachings: [Teaching]
    let hasMore: Bool
}
