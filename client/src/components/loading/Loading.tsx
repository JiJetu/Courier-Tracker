const Loading = ({ smallHeight }: { smallHeight?: boolean }) => {
  return (
    <div
      className={` w-full ${smallHeight ? "h-[250px]" : "h-[70vh]"}
      flex 
      flex-col
      justify-center 
      items-center text-purple-700`}
    >
      <div>
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
};

export default Loading;
