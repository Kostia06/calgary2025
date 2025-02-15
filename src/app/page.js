export default function Home() {
  return (
    <main className="min-h-screen bg-green-100">
      <header className="bg-green-500 text-white p-4">
        <h1 className="text-3xl font-bold">Nature Web App</h1>
      </header>
      <section className="p-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Welcome to Nature</h2>
          <p className="text-gray-700">
            Explore the beauty of nature through our web application. Stay tuned for more updates!
          </p>
        </div>
      </section>
      <footer className="bg-green-500 text-white p-4 mt-8">
        <p>&copy; 2025 Nature Web App. All rights reserved.</p>
      </footer>
    </main>
  );
}
