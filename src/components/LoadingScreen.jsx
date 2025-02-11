import { useProgress } from "@react-three/drei";

const LoadingScreen = ({ isLoading}) => {
  const { progress, active } = useProgress();

  // Mostrar el LoadingScreen si `active` de useProgress o `isLoading` están activos
  const isVisible = active || isLoading;

  return (
    <div className={`loading-screen ${isVisible ? "" : "loading-screen--hidden"}`}>
      <div className="loading-screen__container">
        {/* <div className="progress__container">
          <div
            className="progress__bar"
            style={{ width: `${visibleProgress}%` }}
          ></div>
        </div> */}
      </div>
    </div>
  );
};

export default LoadingScreen;
