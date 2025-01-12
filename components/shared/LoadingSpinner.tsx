const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex space-x-2">
          <div className="h-6 w-6 rounded-full bg-blue-500 animate-bounce"></div>
          <div className="h-6 w-6 rounded-full bg-red-500 animate-bounce delay-200"></div>
          <div className="h-6 w-6 rounded-full bg-green-500 animate-bounce delay-400"></div>
        </div>
      </div>
    );
  };
  
  export default LoadingSpinner;
  