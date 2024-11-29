import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import '../ThreeCanvas.css'; // Asegúrate de crear este archivo CSS

const ThreeCanvas = () => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const movement = useRef({ forward: false, backward: false, left: false, right: false });
  const playerRotation = useRef(0);
  const zoomDistance = useRef(10);
  const playerRef = useRef(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, zoomDistance.current);

    let renderer = rendererRef.current;
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const loader = new GLTFLoader();
    loader.load(
      '/models/character.glb',
      (gltf) => {
        const player = gltf.scene;
        player.scale.set(0.05, 0.05, 0.05); // Ajusta la escala del modelo para que sea más pequeño
        player.position.set(0, 0, 0);
        scene.add(player);
        playerRef.current = player;

        const mixer = new THREE.AnimationMixer(player);
        mixerRef.current = mixer;

        if (gltf.animations && gltf.animations.length > 0) {
          const walkAnimation = gltf.animations[0]; // Usar la animación de caminar
          const walkAction = mixer.clipAction(walkAnimation);

          // Guardar la referencia de la acción para poder pausarla/reanudarla
          playerRef.current.action = walkAction;
        }
      },
      undefined,
      (error) => {
        console.error('Error cargando el modelo 3D:', error);
      }
    );

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
        case 'W':
          movement.current.forward = true;
          break;
        case 's':
        case 'S':
          movement.current.backward = true;
          break;
        case 'a':
        case 'A':
          movement.current.left = true;
          break;
        case 'd':
        case 'D':
          movement.current.right = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w':
        case 'W':
          movement.current.forward = false;
          break;
        case 's':
        case 'S':
          movement.current.backward = false;
          break;
        case 'a':
        case 'A':
          movement.current.left = false;
          break;
        case 'd':
        case 'D':
          movement.current.right = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const handleWheel = (event) => {
      zoomDistance.current += event.deltaY * 0.01;
      zoomDistance.current = Math.max(5, Math.min(zoomDistance.current, 50));
    };

    window.addEventListener('wheel', handleWheel);

    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      const moveSpeed = 0.1;
      const rotationSpeed = 0.02;

      if (playerRef.current) {
        const player = playerRef.current;
        let isMoving = false;

        if (movement.current.forward) {
          player.position.x -= Math.sin(playerRotation.current) * moveSpeed;
          player.position.z -= Math.cos(playerRotation.current) * moveSpeed;
          isMoving = true;
        }
        if (movement.current.backward) {
          player.position.x += Math.sin(playerRotation.current) * moveSpeed;
          player.position.z += Math.cos(playerRotation.current) * moveSpeed;
          isMoving = true;
        }
        if (movement.current.left) {
          playerRotation.current += rotationSpeed;
          player.rotation.y = playerRotation.current;
        }
        if (movement.current.right) {
          playerRotation.current -= rotationSpeed;
          player.rotation.y = playerRotation.current;
        }

        // Reproducir o pausar la animación de caminar según el estado de movimiento
        if (player.action) {
          if (isMoving) {
            if (!player.action.isRunning()) {
              player.action.play();
            }
          } else {
            if (player.action.isRunning()) {
              player.action.stop();
            }
          }
        }

        camera.position.set(
          player.position.x - Math.sin(playerRotation.current) * zoomDistance.current,
          player.position.y + 5,
          player.position.z - Math.cos(playerRotation.current) * zoomDistance.current
        );
        camera.lookAt(player.position);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('wheel', handleWheel);

      if (rendererRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  return <div ref={canvasRef} className="three-canvas-container"></div>;
};

export default ThreeCanvas;
