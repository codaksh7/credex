'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const mat = new THREE.LineBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.35 });
    const lines = new THREE.LineSegments(wireframe, mat);
    scene.add(lines);

    const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.15 });
    const innerLines = new THREE.LineSegments(innerWire, innerMat);
    scene.add(innerLines);

    const dotGeo = new THREE.BufferGeometry();
    const vertices = geo.attributes.position.array;
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x00e676, size: 0.04, transparent: true, opacity: 0.8 });
    const dots = new THREE.Points(dotGeo, dotMat);
    scene.add(dots);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouse);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      targetRotX += (mouseY * 0.3 - targetRotX) * 0.05;
      targetRotY += (mouseX * 0.5 - targetRotY) * 0.05;

      lines.rotation.x = targetRotX + performance.now() * 0.0001;
      lines.rotation.y = targetRotY + performance.now() * 0.0002;
      dots.rotation.x = lines.rotation.x;
      dots.rotation.y = lines.rotation.y;

      innerLines.rotation.x = -targetRotX + performance.now() * 0.00015;
      innerLines.rotation.y = -targetRotY + performance.now() * 0.00025;

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
