const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <p className="text-red-500 mt-4" role="alert">
      Error: {message}
    </p>
  );
};

export default ErrorMessage;
