type Props = {
  params: {
    user_id: string;
  };
};

export default function UserProfile({ params }: Props) {
  const { user_id } = params;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {/* 用户图标 */}
        <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          用户资料
        </h1>
        
        <div className="bg-gray-100 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-500 mb-1">{user_id}</p>
          
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
            关注
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
            发消息
          </button>
        </div>
      </div>
    </div>
  );
}