'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TOOL_DATA = [
  { name: 'Cursor', savings: 40, position: [1.2, 0.8, 0.5] },
  { name: 'Copilot', savings: 25, position: [-0.9, 1.1, -0.3] },
  { name: 'Claude', savings: 55, position: [0.3, -1.0, 0.8] },
  { name: 'ChatGPT', savings: 30, position: [-1.1, -0.4, -0.7] },
  { name: 'Gemini', savings: 15, position: [0.8, -0.6, -1.0] },
  { name: 'Windsurf', savings: 35, position: [-0.5, 0.9, 1.0] },
];

export default function WireframeSphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geo = new THREE.IcosahedronGeometry(1.6, 2);
    const wireframe = new THREE.WireframeGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.25 });
    const lines = new THREE.LineSegments(wireframe, mat);
    scene.add(lines);

    const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.1 });
    const innerLines = new THREE.LineSegments(innerWire, innerMat);
    scene.add(innerLines);

    const toolNodes: THREE.Mesh[] = [];
    TOOL_DATA.forEach((tool) => {
      const nodeGeo = new THREE.SphereGeometry(0.06 + tool.savings * 0.001, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.9 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(tool.position[0] * 1.3, tool.position[1] * 1.3, tool.position[2] * 1.3);
      scene.add(node);
      toolNodes.push(node);
    });

    let isHovering = false;
    let hoverX = 0;
    let hoverY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const inBounds = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inBounds) {
        isHovering = true;
        hoverX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        hoverY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      } else {
        isHovering = false;
      }
    };

    window.addEventListener('mousemove', handleMouse);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isHovering) {
        targetRotX += (hoverY * 0.3 - targetRotX) * 0.05;
        targetRotY += (hoverX * 0.5 - targetRotY) * 0.05;
      } else {
        targetRotX *= 0.95;
        targetRotY *= 0.95;
      }

      lines.rotation.x = targetRotX + performance.now() * 0.0001;
      lines.rotation.y = targetRotY + performance.now() * 0.0002;
      innerLines.rotation.x = -targetRotX + performance.now() * 0.00015;
      innerLines.rotation.y = -targetRotY + performance.now() * 0.00025;

      toolNodes.forEach((node, i) => {
        const basePos = TOOL_DATA[i].position;
        const time = performance.now() * 0.001;
        node.position.x = basePos[0] * 1.3 + Math.sin(time + i) * 0.05;
        node.position.y = basePos[1] * 1.3 + Math.cos(time + i * 0.7) * 0.05;
        node.position.z = basePos[2] * 1.3 + Math.sin(time * 0.5 + i * 1.3) * 0.03;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '50%',
        right: '-5%',
        transform: 'translateY(-50%)',
        width: '45%',
        height: '80%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
