// PocketPrayersApp.swift
// Main entry point for Pocket Prayers iOS App

import SwiftUI

@main
struct PocketPrayersApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var prayerManager = PrayerManager()
    @StateObject private var teachingsManager = TeachingsManager()
    
    var body: some Scene {
        WindowGroup {
            if authManager.isAuthenticated {
                MainTabView()
                    .environmentObject(authManager)
                    .environmentObject(prayerManager)
                    .environmentObject(teachingsManager)
            } else {
                WelcomeView()
                    .environmentObject(authManager)
            }
        }
    }
}
