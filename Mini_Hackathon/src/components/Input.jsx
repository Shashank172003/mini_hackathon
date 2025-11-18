export default function Input({ icon, type, placeholder, value, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex items-center bg-purple-100 px-4 py-3 rounded-full">
        <span className="mr-3">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="bg-transparent w-full outline-none"
        />
      </div>
    </div>
  );
}
