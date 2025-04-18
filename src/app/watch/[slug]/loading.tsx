const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
    <img
      src="/cat.gif"
      alt="Loading cat"
      className="w-50 h-50 object-contain"
    />
    <span className="text-white">Đang tải...</span>
  </div>
)

export default Loading
