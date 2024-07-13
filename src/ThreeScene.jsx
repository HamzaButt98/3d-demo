import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(145, 250, 145);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Toon Fireballs
    const fireballCount = 45; // Number of fireballs
    const fireballs = [];

    const toonMaterial = new THREE.MeshToonMaterial({
      color: 0x50C878, // Emerald green color
      transparent: true,
      opacity: 0.1 // Decreased opacity for the fireballs
    });

    for (let i = 0; i < fireballCount; i++) {
      const geometry = new THREE.SphereGeometry(2, 30, 30);
      const fireball = new THREE.Mesh(geometry, toonMaterial);

      fireball.position.x = (Math.random() - 0.5) * 170; // Increase the range to scatter more
      fireball.position.y = (Math.random() - 0.5) * 200; // Increase the range to scatter more
      fireball.position.z = -100;

      fireball.castShadow = true;
      fireball.receiveShadow = true;

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5, // Random x velocity
        (Math.random() - 0.5) * 0.5, // Random y velocity
        1 // z velocity towards the camera
      );

      fireballs.push({
        mesh: fireball,
        velocity: velocity,
        trail: []
      });

      scene.add(fireball);
    }

    // Function to create a trail segment
    const createTrailSegment = (fireball) => {
      const trailMaterial = toonMaterial.clone();
      trailMaterial.transparent = true;
      trailMaterial.opacity = 0.2;

      const trailSegment = new THREE.Mesh(fireball.mesh.geometry, trailMaterial);
      trailSegment.position.copy(fireball.mesh.position);
      trailSegment.castShadow = true;
      trailSegment.receiveShadow = true;

      scene.add(trailSegment);
      fireball.trail.push(trailSegment);

      // Remove the oldest trail segment if the trail gets too long
      if (fireball.trail.length > 45) {
        const oldSegment = fireball.trail.shift();
        scene.remove(oldSegment);
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      fireballs.forEach(fireball => {
        fireball.mesh.position.add(fireball.velocity);

        // Create a new trail segment
        createTrailSegment(fireball);

        // Fade out the trail segments over time
        fireball.trail.forEach((segment, index) => {
          segment.material.opacity = Math.max(0.1, 0.03 - (index * 0.05));
        });

        // Reset fireball position if it goes past the camera
        if (fireball.mesh.position.z > camera.position.z) {
          fireball.mesh.position.x = (Math.random() - 0.5) * 170; // Increase the range to scatter more
          fireball.mesh.position.y = (Math.random() - 0.5) * 200; // Increase the range to scatter more
          fireball.mesh.position.z = -100;

          // Assign new random velocity
          fireball.velocity.set(
            (Math.random() - 0.5) * 0.5, // Random x velocity
            (Math.random() - 0.5) * 0.5, // Random y velocity
            1 // z velocity towards the camera
          );

          // Clear the trail when resetting position
          fireball.trail.forEach(segment => {
            scene.remove(segment);
          });
          fireball.trail = [];
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="relative">
      <div className="absolute inset-0 flex items-center justify-center mb-3">
        <div className="text-center">
          <h1 className="text-green-600 text-7xl font-mono">
            Unlock the Power <br /> of Chaos Control
          </h1>
          <h4 className="mt-10 text-lg text-white font-mono">
            Get back control with Metabase Q's Cybersecurity <br />
            Management system and get back your time
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;
