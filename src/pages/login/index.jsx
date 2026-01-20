import { LoginForm } from "@/components/login-form";

const Login = () => {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2 bg-[#0a0a0a]">
      {/* Left Side - Illustration */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-[#0a0a0a] p-12">

        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="text-white text-xl font-semibold">AdsOnWay</span>
        </div>

        {/* Illustration placeholder - using a gradient box as placeholder */}
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-500/20 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-30 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <svg className="w-48 h-48 mx-auto text-blue-400/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>


      </div>


      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-700/50"></div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-[#0a0a0a]">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
