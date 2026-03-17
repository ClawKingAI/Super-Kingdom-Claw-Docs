export default function FloatingCallButton() {
  return (
    <a
      href="tel:470-215-4009"
      className="fixed bottom-6 right-6 z-50 lg:hidden bg-water-600 hover:bg-water-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105"
      aria-label="Call 470-215-4009"
    >
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-water-600 animate-ping opacity-30"></span>
    </a>
  )
}
