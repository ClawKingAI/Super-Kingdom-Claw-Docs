import SwiftUI

@main
struct PocketPrayersApp: App {
    @StateObject private var authManager = AuthManager()
    
    var body: some Scene {
        WindowGroup {
            if authManager.isAuthenticated {
                MainTabView()
                    .environmentObject(authManager)
            } else {
                WelcomeView()
                    .environmentObject(authManager)
            }
        }
    }
}

// MARK: - Main Tab View
struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
                .tag(0)
            
            PrayerWallView()
                .tabItem {
                    Image(systemName: "hands.sparkles.fill")
                    Text("Prayers")
                }
                .tag(1)
            
            PostPrayerView()
                .tabItem {
                    Image(systemName: "plus.circle.fill")
                    Text("Post")
                }
                .tag(2)
            
            TeachingsView()
                .tabItem {
                    Image(systemName: "book.fill")
                    Text("Teachings")
                }
                .tag(3)
            
            ProfileView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
                }
                .tag(4)
        }
        .tint(.purple)
    }
}

// MARK: - Welcome View
struct WelcomeView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var showLogin = false
    @State private var showRegister = false
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color.purple.opacity(0.8), Color.indigo.opacity(0.9)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                Image(systemName: "hands.sparkles.fill")
                    .font(.system(size: 80))
                    .foregroundColor(.white)
                
                Text("Pocket Prayers")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Text("Welcome to your prayer community")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.9))
                
                VStack(spacing: 16) {
                    Button(action: { showLogin = true }) {
                        Text("Sign In")
                            .font(.headline)
                            .foregroundColor(.purple)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white)
                            .cornerRadius(12)
                    }
                    
                    Button(action: { showRegister = true }) {
                        Text("Create Account")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(12)
                    }
                }
                .padding(.horizontal, 40)
            }
        }
        .sheet(isPresented: $showLogin) {
            LoginView()
        }
        .sheet(isPresented: $showRegister) {
            RegisterView()
        }
    }
}

// MARK: - Home View
struct HomeView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Welcome Banner
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Welcome Home")
                            .font(.title)
                            .fontWeight(.bold)
                        
                        Text("Your prayer community is here for you")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)
                    
                    // Latest Teachings
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Latest Teachings")
                            .font(.headline)
                            .padding(.horizontal)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(sampleTeachings.prefix(5)) { teaching in
                                    TeachingCard(teaching: teaching)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                    
                    // Recent Prayers
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Recent Prayers")
                                .font(.headline)
                            Spacer()
                            NavigationLink("See All", destination: PrayerWallView())
                                .font(.subheadline)
                        }
                        .padding(.horizontal)
                        
                        ForEach(samplePrayers.prefix(3)) { prayer in
                            PrayerCard(prayer: prayer)
                                .padding(.horizontal)
                        }
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Pocket Prayers")
        }
    }
}

// MARK: - Prayer Wall View
struct PrayerWallView: View {
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(samplePrayers) { prayer in
                        PrayerCard(prayer: prayer)
                    }
                }
                .padding()
            }
            .navigationTitle("Community Prayers")
        }
    }
}

// MARK: - Post Prayer View
struct PostPrayerView: View {
    @State private var prayerText = ""
    @State private var isAnonymous = false
    @State private var showingSuccess = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                TextEditor(text: $prayerText)
                    .frame(minHeight: 200)
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.purple.opacity(0.3), lineWidth: 1)
                    )
                    .overlay(alignment: .topLeading) {
                        if prayerText.isEmpty {
                            Text("Write your prayer here...")
                                .foregroundColor(.secondary)
                                .padding()
                        }
                    }
                
                Toggle("Post Anonymously", isOn: $isAnonymous)
                    .padding(.horizontal)
                
                Spacer()
                
                Button(action: { showingSuccess = true }) {
                    Text("Share Prayer")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(prayerText.isEmpty ? Color.gray : Color.purple)
                        .cornerRadius(12)
                }
                .disabled(prayerText.isEmpty)
                .padding(.horizontal)
            }
            .padding()
            .navigationTitle("Share Your Prayer")
            .alert("Prayer Shared", isPresented: $showingSuccess) {
                Button("OK", role: .cancel) { prayerText = "" }
            } message: {
                Text("Your prayer has been shared with the community.")
            }
        }
    }
}

// MARK: - Teachings View
struct TeachingsView: View {
    @StateObject private var subscriptionManager = SubscriptionManager()
    
    var body: some View {
        NavigationView {
            Group {
                if subscriptionManager.isSubscribed {
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(sampleTeachings) { teaching in
                                TeachingDetailCard(teaching: teaching)
                            }
                        }
                        .padding()
                    }
                } else {
                    VStack(spacing: 24) {
                        Image(systemName: "lock.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.purple)
                        
                        Text("Exclusive Teachings")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("Subscribe to unlock our complete library of teachings on prayer and intercession.")
                            .multilineTextAlignment(.center)
                            .foregroundColor(.secondary)
                        
                        Button(action: { subscriptionManager.subscribe() }) {
                            Text("Subscribe - $5/month")
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.purple)
                                .cornerRadius(12)
                        }
                        .padding(.horizontal, 40)
                    }
                }
            }
            .navigationTitle("Teachings Library")
        }
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var subscriptionManager = SubscriptionManager()
    
    var body: some View {
        NavigationView {
            List {
                Section("Account") {
                    HStack {
                        Image(systemName: "person.circle.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.purple)
                        
                        VStack(alignment: .leading) {
                            Text("Prayer Warrior")
                                .font(.headline)
                            Text(authManager.userEmail)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Section("Subscription") {
                    HStack {
                        Text("Status")
                        Spacer()
                        Text(subscriptionManager.isSubscribed ? "Active" : "Free")
                            .foregroundColor(subscriptionManager.isSubscribed ? .green : .secondary)
                    }
                    
                    if !subscriptionManager.isSubscribed {
                        Button("Upgrade to Premium - $5/month") {
                            subscriptionManager.subscribe()
                        }
                    }
                }
                
                Section {
                    Button(role: .destructive, action: { authManager.signOut() }) {
                        HStack {
                            Spacer()
                            Text("Sign Out")
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Profile")
        }
    }
}

// MARK: - Login View
struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var isLoading = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                Image(systemName: "hands.sparkles.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.purple)
                
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .textInputAutocapitalization(.never)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: { authManager.signIn(email: email, password: password) }) {
                    if isLoading {
                        ProgressView()
                            .frame(maxWidth: .infinity)
                    } else {
                        Text("Sign In")
                            .frame(maxWidth: .infinity)
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(.purple)
                .disabled(email.isEmpty || password.isEmpty)
                
                NavigationLink("Forgot Password?", destination: ForgotPasswordView())
                    .font(.subheadline)
            }
            .padding()
            .navigationTitle("Sign In")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Register View
struct RegisterView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                TextField("Email", text: $email)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .textInputAutocapitalization(.never)
                
                SecureField("Password", text: $password)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                SecureField("Confirm Password", text: $confirmPassword)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: { authManager.register(email: email, password: password) }) {
                    Text("Create Account")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(.purple)
                .disabled(email.isEmpty || password.isEmpty || password != confirmPassword)
            }
            .padding()
            .navigationTitle("Create Account")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

// MARK: - Forgot Password View
struct ForgotPasswordView: View {
    @State private var email = ""
    @State private var showingSuccess = false
    
    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "key.fill")
                .font(.system(size: 50))
                .foregroundColor(.purple)
            
            Text("Enter your email to receive a password reset link.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
            
            TextField("Email", text: $email)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .textInputAutocapitalization(.never)
            
            Button(action: { showingSuccess = true }) {
                Text("Send Reset Link")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.purple)
            .disabled(email.isEmpty)
        }
        .padding()
        .navigationTitle("Reset Password")
        .alert("Email Sent", isPresented: $showingSuccess) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("Check your email for password reset instructions.")
        }
    }
}

// MARK: - Components
struct PrayerCard: View {
    let prayer: Prayer
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "person.circle.fill")
                    .foregroundColor(.purple)
                Text(prayer.author)
                    .font(.subheadline)
                    .fontWeight(.medium)
                Spacer()
                Text(prayer.timestamp, style: .relative)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Text(prayer.content)
                .font(.body)
            
            HStack(spacing: 16) {
                Button(action: { }) {
                    HStack(spacing: 4) {
                        Image(systemName: "hands.sparkles")
                        Text("\(prayer.prayersCount)")
                    }
                }
                .foregroundColor(.purple)
                
                Button(action: { }) {
                    Image(systemName: "square.and.arrow.up")
                }
                .foregroundColor(.secondary)
            }
            .font(.caption)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct TeachingCard: View {
    let teaching: Teaching
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: URL(string: teaching.thumbnail)) { image in
                image.resizable()
            } placeholder: {
                Rectangle()
                    .fill(Color.purple.opacity(0.3))
                    .overlay(Image(systemName: "play.fill").foregroundColor(.white))
            }
            .frame(width: 160, height: 90)
            .cornerRadius(8)
            
            Text(teaching.title)
                .font(.subheadline)
                .fontWeight(.medium)
                .lineLimit(2)
        }
        .frame(width: 160)
    }
}

struct TeachingDetailCard: View {
    let teaching: Teaching
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            AsyncImage(url: URL(string: teaching.thumbnail)) { image in
                image.resizable()
            } placeholder: {
                Rectangle()
                    .fill(Color.purple.opacity(0.3))
            }
            .frame(height: 180)
            .cornerRadius(12)
            
            Text(teaching.title)
                .font(.headline)
            
            Text(teaching.description)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Button(action: { }) {
                HStack {
                    Image(systemName: "play.fill")
                    Text("Watch Now")
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.purple)
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

// MARK: - Models
struct Prayer: Identifiable {
    let id = UUID()
    let author: String
    let content: String
    let timestamp: Date
    let prayersCount: Int
}

struct Teaching: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let thumbnail: String
}

// MARK: - Sample Data
let samplePrayers: [Prayer] = [
    Prayer(author: "Sarah M.", content: "Lord, please be with my mother as she faces surgery tomorrow. Give her peace and guide the doctors' hands.", timestamp: Date().addingTimeInterval(-3600), prayersCount: 24),
    Prayer(author: "Anonymous", content: "I lift up my marriage to You, Lord. Restore what has been broken and bring us closer together.", timestamp: Date().addingTimeInterval(-7200), prayersCount: 18),
    Prayer(author: "James K.", content: "Thank You, God, for Your faithfulness. You have provided when I saw no way. You are good!", timestamp: Date().addingTimeInterval(-10800), prayersCount: 31),
    Prayer(author: "Prayer Warrior", content: "Father, I ask for breakthrough in my son's life. Draw him close to You and open his eyes to Your love.", timestamp: Date().addingTimeInterval(-14400), prayersCount: 45),
]

let sampleTeachings: [Teaching] = [
    Teaching(title: "The Power of Intercession", description: "Learn how to stand in the gap for others through biblical intercession.", thumbnail: "https://via.placeholder.com/160x90/6B21A8/FFFFFF?text=Teaching"),
    Teaching(title: "Hearing God's Voice", description: "Practical steps to recognize when God is speaking to you.", thumbnail: "https://via.placeholder.com/160x90/7C3AED/FFFFFF?text=Teaching"),
    Teaching(title: "Praying in the Spirit", description: "Understanding Spirit-led prayer and its transformative power.", thumbnail: "https://via.placeholder.com/160x90/8B5CF6/FFFFFF?text=Teaching"),
]

// MARK: - Managers
class AuthManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var userEmail = ""
    
    func signIn(email: String, password: String) {
        // TODO: Implement with Supabase or Firebase
        userEmail = email
        isAuthenticated = true
    }
    
    func register(email: String, password: String) {
        // TODO: Implement with Supabase or Firebase
        userEmail = email
        isAuthenticated = true
    }
    
    func signOut() {
        isAuthenticated = false
        userEmail = ""
    }
}

class SubscriptionManager: ObservableObject {
    @Published var isSubscribed = false
    
    func subscribe() {
        // TODO: Implement with RevenueCat or similar
        isSubscribed = true
    }
}
