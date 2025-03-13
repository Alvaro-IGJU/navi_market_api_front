import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FerrotallMachine from "./FerrotallMachine";

const MachineBlueprintView = ({ selectedMachine, onClose }) => {
  const [activeTab, setActiveTab] = useState("image");
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const detectMobile = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio;

      // Detect mobiles even in landscape mode
      const mobileThreshold = 850; // Adjust this value for wider phones
      setIsMobile((width <= mobileThreshold || height <= mobileThreshold) && pixelRatio > 1);
    };

    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  if (!selectedMachine) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <>
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <div 
          style={{
            position: "relative",
            width: "75vw",
            height: "80vh",
            backgroundImage: "url('/multimedia/images/blueprint.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            padding: "3vw",
            gap: "30px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "10px 15px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              zIndex: 1001,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
            }}
          >
            ❌ 
          </button>

          <div 
            style={{
              width: "50%",
              height: "75%",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 25px rgba(0, 0, 0, 0.4)",
              padding: "20px"
            }}
          >
            {activeTab === "image" && (
              <Canvas camera={{ position: [5, 2, 5], fov: 30 }}>
                <ambientLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <FerrotallMachine position={[0, 0, 0]} rotation={[0, -0.8, 0]} />
                <OrbitControls 
                  minDistance={3}   
                  maxDistance={10}  
                  minPolarAngle={Math.PI / 6} 
                  maxPolarAngle={Math.PI / 2} 
                />
              </Canvas>
            )}
            {activeTab === "specs" && (
              <div
                style={{
                  width: "90%",
                  height: "90%",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="/vurcon/info/PL50_1500_FAGOR_esp.pdf"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "10px", border: "none" }}
                />
              </div>
            )}
            {activeTab === "video" && (
              <iframe
                width="100%"
                height="80%"
                src={selectedMachine.videoUrl}
                title="Video de la máquina"
                frameBorder="0"
                allowFullScreen
                style={{ borderRadius: "15px" }}
              />
            )}
          </div>

          <div 
            style={{
              width: "30%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0",
            }}
          >
            <button onClick={() => setActiveTab("specs")} style={buttonStyle(isMobile)}>
              📄 Ficha Técnica
            </button>
            <button onClick={() => setActiveTab("image")} style={buttonStyle(isMobile)}>
              🔍 Vista Máquina
            </button>
            <button onClick={() => setActiveTab("video")} style={buttonStyle(isMobile)}>
              ▶️ Video Máquina
            </button>
            <button onClick={() => setActiveTab("contact")} style={buttonStyle(isMobile)}>
              ℹ️ Solicitar Información
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ Dynamic button styling based on screen size
const buttonStyle = (isMobile) => ({
  background: "#48cae4",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: isMobile ? "2%" : "10%",
  fontSize: "1em",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
  maxWidth: "300px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
});

export default MachineBlueprintView;
