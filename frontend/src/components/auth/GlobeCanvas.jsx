import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

/**
 * 3D Interactive Rotating Globe Component.
 * Loads `/metallic_blue_globe.obj` using Three.js with realistic metallic shaders,
 * studio lighting, smooth continuous auto-rotation, and interactive drag-to-spin.
 */
export function GlobeCanvas({ className = "" }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lighting setup (studio lighting for chrome/metallic reflection)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 4, 4);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    cyanRimLight.position.set(-5, -2, -3);
    scene.add(cyanRimLight);

    const blueBackLight = new THREE.PointLight(0x60a5fa, 2.0, 10);
    blueBackLight.position.set(0, 3, -2);
    scene.add(blueBackLight);

    // 3. Globe Parent Group (with natural axial tilt)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.38; // ~22° Earth axial tilt
    globeGroup.rotation.x = 0.12;
    scene.add(globeGroup);

    // 4. Metallic Materials
    const continentMaterial = new THREE.MeshStandardMaterial({
      color: 0x93c5fd, // Metallic chrome sky blue
      metalness: 0.95,
      roughness: 0.22,
      emissive: 0x1e40af,
      emissiveIntensity: 0.2,
    });

    const oceanMaterial = new THREE.MeshStandardMaterial({
      color: 0x071527, // Deep glossy cobalt ocean
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0369a1,
      emissiveIntensity: 0.15,
    });

    // 5. Load OBJ Model
    let globeModel = null;
    const loader = new OBJLoader();

    loader.load(
      "/metallic_blue_globe.obj",
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            const isOcean =
              child.name.toLowerCase().includes("ocean") ||
              child.name.toLowerCase().includes("sea");

            child.material = isOcean ? oceanMaterial : continentMaterial;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        globeModel = obj;
        globeGroup.add(obj);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("Failed to load metallic_blue_globe.obj:", error);
        setIsLoading(false);
      }
    );

    // 6. Interactive Drag Controls & Momentum
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      dragVelocity = { x: 0, y: 0 };
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      dragVelocity = { x: deltaX * 0.005, y: deltaY * 0.005 };
      globeGroup.rotation.y += dragVelocity.x;
      globeGroup.rotation.x += dragVelocity.y;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        // Continuous auto-rotation
        globeGroup.rotation.y += 0.006;

        // Apply drag inertia decay
        if (Math.abs(dragVelocity.x) > 0.0001 || Math.abs(dragVelocity.y) > 0.0001) {
          globeGroup.rotation.y += dragVelocity.x;
          globeGroup.rotation.x += dragVelocity.y;
          dragVelocity.x *= 0.94;
          dragVelocity.y *= 0.94;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      resizeObserver.disconnect();

      if (globeModel) {
        globeModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
          }
        });
      }
      continentMaterial.dispose();
      oceanMaterial.dispose();
      renderer.dispose();

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-48 animate-pulse rounded-full bg-accent/20 blur-md sm:size-60" />
        </div>
      )}
    </div>
  );
}

export default GlobeCanvas;
