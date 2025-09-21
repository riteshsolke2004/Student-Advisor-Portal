import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {/* Google Fonts Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;700&family=Roboto:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        {/* Google Material Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Google-style Brand */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="material-icons text-white text-xl">school</span>
                  </div>
                  <div>
                    <h1
                      className="text-2xl font-medium text-gray-900"
                      style={{ fontFamily: "Google Sans, sans-serif" }}
                    >
                      Student Advisor
                    </h1>
                    <div
                      className="text-sm text-blue-600 -mt-1"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      Powered by Google AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Google Material styling */}
        <main className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto relative">
            {/* Google-style Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/5 to-purple-400/5 blur-3xl" />
              <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-green-400/5 to-yellow-400/5 blur-3xl" />
            </div>

            {children}
          </div>
        </main>
      </div>
    </>
  );
};
