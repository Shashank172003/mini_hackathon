export default function AuthLayout({ children, title }) {
  return (
    <div className="h-screen flex">
      
      {/* LEFT IMAGE */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <img
          src="https://i.ibb.co/3pPHfYy/signup-illustration.png"
          className="w-3/4"
          alt="auth"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-3/4 max-w-md">
          <h2 className="text-3xl font-bold text-purple-700 mb-6">{title}</h2>
          {children}
        </div>
      </div>

    </div>
  );
}
