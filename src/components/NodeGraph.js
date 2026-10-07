import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './NodeGraph.css';

const getNodeColor = (type) => {
  if (type === 'drive') return 0x00d4ff;
  if (type === 'folder') return 0x00ff88;
  return 0xff006e;
};

const NodeGraph = ({ data, onNodeClick, selectedNodeId }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshMapRef = useRef({});
  const orbitRef = useRef({ yaw: 0.7, pitch: 0.4, distance: 14 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      3000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d4ff, 1.8, 40);
    pointLight1.position.set(8, 6, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff006e, 1.2, 40);
    pointLight2.position.set(-8, -4, 8);
    scene.add(pointLight2);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    meshMapRef.current = {};
    const lineObjects = [];

    // Update camera from orbit controls
    const updateCameraOrbit = () => {
      const { yaw, pitch, distance } = orbitRef.current;
      const x = Math.cos(yaw) * Math.cos(pitch) * distance;
      const y = Math.sin(pitch) * distance;
      const z = Math.sin(yaw) * Math.cos(pitch) * distance;
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };

    // Create nodes
    data.nodes.forEach((nodeData) => {
      const geometry = new THREE.SphereGeometry(nodeData.size * 0.4, 48, 48);
      const material = new THREE.MeshPhongMaterial({
        color: getNodeColor(nodeData.type),
        emissive: getNodeColor(nodeData.type),
        emissiveIntensity: 0.32,
        shininess: 100,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(nodeData.x, nodeData.y, nodeData.z);
      mesh.userData = { nodeId: nodeData.id, type: nodeData.type };
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      meshMapRef.current[nodeData.id] = mesh;

      // Glow
      const glowGeometry = new THREE.SphereGeometry(nodeData.size * 0.5, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: getNodeColor(nodeData.type),
        transparent: true,
        opacity: 0.1,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(mesh.position);
      scene.add(glow);
    });

    // Create links
    data.links.forEach((link) => {
      const source = meshMapRef.current[link.source];
      const target = meshMapRef.current[link.target];
      if (!source || !target) return;

      const points = [source.position.clone(), target.position.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.4,
        linewidth: 1,
      });
      const line = new THREE.Line(geometry, material);
      lineObjects.push(line);
      scene.add(line);
    });

    // Mouse interactions
    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Object.values(meshMapRef.current)
      );

      if (intersects.length > 0) {
        const nodeId = intersects[0].object.userData.nodeId;
        if (nodeId) onNodeClick(nodeId);
      }
    };

    let isDragging = false;
    let prevX = 0,
      prevY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      orbitRef.current.yaw -= deltaX * 0.006;
      orbitRef.current.pitch -= deltaY * 0.005;
      orbitRef.current.pitch = Math.max(-1.1, Math.min(1.1, orbitRef.current.pitch));

      updateCameraOrbit();

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      orbitRef.current.distance = Math.max(
        5,
        Math.min(28, orbitRef.current.distance + e.deltaY * 0.012)
      );
      updateCameraOrbit();
    };

    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate nodes
      Object.entries(meshMapRef.current).forEach(([nodeId, mesh]) => {
        const isSelected = nodeId === selectedNodeId;
        const targetScale = isSelected ? 1.4 : 1.0;

        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        mesh.material.emissiveIntensity = isSelected ? 0.85 : 0.32;
        mesh.rotation.x += 0.0015;
        mesh.rotation.y += 0.0025;
      });

      updateCameraOrbit();
      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);
    updateCameraOrbit();

    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [data, onNodeClick, selectedNodeId]);

  return <div ref={containerRef} className="node-graph" />;
};

export default NodeGraph;
