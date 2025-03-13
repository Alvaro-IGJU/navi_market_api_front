import React, { useEffect, useState, useRef, useContext } from "react";
import Peer from "simple-peer";
import { useSocket } from "../contexts/SocketContext";
import { LocalPlayerContext } from "../contexts/LocalPlayerContext";
import { Vector3 } from "three";

const VOICE_PROXIMITY_THRESHOLD = 100; // Distancia máxima para conexión de voz

const VoiceChatManager = () => {
  const socket = useSocket();
  const { position: myPosition } = useContext(LocalPlayerContext);
  const [remotePlayers, setRemotePlayers] = useState({});
  const peersRef = useRef({}); // { socketId: { peer, audio, panner } }
  const localAudioStreamRef = useRef(null);
  const audioContextRef = useRef(null);

  // Al montar el componente, unirse al evento (por ejemplo, eventId 0)
  useEffect(() => {
    socket.emit("joinEvent", { eventId: 0 });
  }, [socket]);

  // Capturar audio local y loguear el stream capturado
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true })
  //     .then((stream) => {
  //       console.log("Audio stream captured successfully:", stream);
  //       localAudioStreamRef.current = stream;
  //       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
  //     })
  //     .catch((err) => console.error("Error al capturar audio:", err));
  // }, []);

  // Escuchar actualizaciones de otros jugadores
  useEffect(() => {
    const handlePlayerUpdate = (data) => {
      // data: { id, position, username }
      console.log("playerUpdate recibido:", data);
      setRemotePlayers((prev) => ({
        ...prev,
        [data.id]: {
          position: new Vector3(...data.position),
          username: data.username,
        },
      }));
    };
    socket.on("playerUpdate", handlePlayerUpdate);
    return () => {
      socket.off("playerUpdate", handlePlayerUpdate);
    };
  }, [socket]);

  // Escuchar señales de voz (para WebRTC)
  useEffect(() => {
    const handleVoiceSignal = ({ from, signal }) => {
      console.log(`Recibida voiceSignal de ${from}:`, signal);
      if (peersRef.current[from]) {
        peersRef.current[from].peer.signal(signal);
      } else {
        if (localAudioStreamRef.current) {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localAudioStreamRef.current,
          });
          peer.on("signal", (data) => {
            console.log(`Emitiendo voiceSignal a ${from} (desde handleVoiceSignal):`, data);
            socket.emit("voiceSignal", { to: from, signal: data });
          });
          peer.on("stream", (remoteStream) => {
            console.log("Recibiendo stream remoto (handleVoiceSignal):", remoteStream);
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.autoplay = true;
            let panner;
            if (audioContextRef.current) {
              panner = audioContextRef.current.createPanner();
              panner.panningModel = "HRTF";
              panner.distanceModel = "linear";
              panner.refDistance = 1;
              panner.maxDistance = VOICE_PROXIMITY_THRESHOLD;
              panner.rolloffFactor = 1;
              const source = audioContextRef.current.createMediaStreamSource(remoteStream);
              source.connect(panner);
              panner.connect(audioContextRef.current.destination);
            }
            peersRef.current[from] = { peer, audio, panner };
          });
          peersRef.current[from] = { peer };
          peer.signal(signal);
        }
      }
    };
    socket.on("voiceSignal", handleVoiceSignal);
    return () => {
      socket.off("voiceSignal", handleVoiceSignal);
    };
  }, [socket]);

  // Función para iniciar conexión de voz con un jugador remoto
  const initiateVoiceConnection = (remoteId) => {
    if (peersRef.current[remoteId] || !localAudioStreamRef.current) return;
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: localAudioStreamRef.current,
    });
    peer.on("signal", (data) => {
      console.log(`Emitiendo voiceSignal a ${remoteId} (desde initiateVoiceConnection):`, data);
      socket.emit("voiceSignal", { to: remoteId, signal: data });
    });
    peer.on("stream", (remoteStream) => {
      console.log("Recibiendo stream remoto (initiateVoiceConnection):", remoteStream);
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
      let panner;
      if (audioContextRef.current) {
        panner = audioContextRef.current.createPanner();
        panner.panningModel = "HRTF";
        panner.distanceModel = "linear";
        panner.refDistance = 1;
        panner.maxDistance = VOICE_PROXIMITY_THRESHOLD;
        panner.rolloffFactor = 1;
        const source = audioContextRef.current.createMediaStreamSource(remoteStream);
        source.connect(panner);
        panner.connect(audioContextRef.current.destination);
      }
      peersRef.current[remoteId] = { peer, audio, panner };
    });
    peersRef.current[remoteId] = { peer };
  };

  // Verificar la proximidad y manejar conexiones de voz cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(remotePlayers).forEach((remoteId) => {
        const remoteData = remotePlayers[remoteId];
        const distance = myPosition.distanceTo(remoteData.position);
        console.log(`Distancia a ${remoteId}:`, distance);
        if (distance < VOICE_PROXIMITY_THRESHOLD) {
          if (!peersRef.current[remoteId]) {
            console.log(`Iniciando conexión de voz con ${remoteId}`);
            initiateVoiceConnection(remoteId);
          }
          const peerObj = peersRef.current[remoteId];
          if (peerObj && peerObj.panner) {
            peerObj.panner.setPosition(
              remoteData.position.x,
              remoteData.position.y,
              remoteData.position.z
            );
          }
        } else {
          if (peersRef.current[remoteId]) {
            console.log(`Destruyendo conexión con ${remoteId} (fuera de rango)`);
            peersRef.current[remoteId].peer.destroy();
            delete peersRef.current[remoteId];
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remotePlayers, myPosition]);

  return null;
};

export default VoiceChatManager;
