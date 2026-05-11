'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import styles from './WireframeSphere.module.css';

const SHELLS = [
  { field: 'Coding & Development', tools: ['Cursor', 'GitHub Copilot', 'Windsurf'] },
  { field: 'Content & Writing', tools: ['Claude', 'ChatGPT', 'Gemini'] },
  { field: 'Data & Research', tools: ['ChatGPT', 'Claude', 'Gemini'] },
  { field: 'Enterprise & APIs', tools: ['Anthropic API', 'OpenAI API', 'Claude'] },
];

export default function WireframeSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeShell, setActiveShell] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const isOpenRef = useRef(false);
  const scrollCooldown = useRef(false);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isOpenRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    if (scrollCooldown.current) return;
    scrollCooldown.current = true;
    setTimeout(() => { scrollCooldown.current = false; }, 600);

    const next = e.deltaY > 0
      ? Math.min(activeShell + 1, SHELLS.length - 1)
      : Math.max(activeShell - 1, 0);
    if (next === activeShell) return;

    setTransitioning(true);
    setTimeout(() => {
      setActiveShell(next);
      setTransitioning(false);
    }, 300);
  }, [activeShell]);

  useEffect(() => {
    const canvasWrap = canvasWrapRef.current;
    const container = containerRef.current;
    if (!canvasWrap || !container) return;

    const width = canvasWrap.clientWidth;
    const height = canvasWrap.clientHeight;
    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasWrap.appendChild(renderer.domElement);

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

    let hoverX = 0, hoverY = 0, isHovering = false;
    let targetRotX = 0, targetRotY = 0;

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

    const handleEnter = () => {
      isOpenRef.current = true;
      setIsOpen(true);
    };

    const handleLeave = () => {
      isOpenRef.current = false;
      setIsOpen(false);
    };

    window.addEventListener('mousemove', handleMouse);
    container.addEventListener('mouseenter', handleEnter);
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('wheel', handleWheel as EventListener, { passive: false });

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
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = canvasWrap.clientWidth;
      const h = canvasWrap.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mouseenter', handleEnter);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('wheel', handleWheel as EventListener);
      renderer.dispose();
      if (canvasWrap.contains(renderer.domElement)) canvasWrap.removeChild(renderer.domElement);
    };
  }, [handleWheel]);

  const shell = SHELLS[activeShell];
  const orbitRadius = 68;
  const fadeClass = !isOpen ? '' : transitioning ? styles.shellFadeOut : styles.shellFadeIn;

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={canvasWrapRef} className={`${styles.canvasWrap} ${isOpen ? styles.canvasHidden : ''}`} />

      <div className={`${styles.splitOverlay} ${isOpen ? styles.splitOpen : ''}`}>
        <div className={styles.hintText}>Scroll to explore domains</div>

        <div className={styles.halfLeft}>
          <div className={`${styles.halfInner} ${fadeClass}`} key={`left-${activeShell}`}>
            <span className={styles.fieldLabel}>Domain</span>
            <span className={styles.fieldName}>{shell.field}</span>
          </div>
        </div>

        <div className={styles.halfRight}>
          <div className={`${styles.halfInner} ${fadeClass}`} key={`right-${activeShell}`}>
            <div className={styles.nucleus} />
            <div className={styles.orbitRing} />
            {shell.tools.map((tool, i) => {
              const angle = (i / shell.tools.length) * 360;
              return (
                <span
                  key={`${activeShell}-${tool}`}
                  className={styles.toolLabel}
                  style={{
                    '--start-angle': `${angle}deg`,
                    '--orbit-radius': `${orbitRadius}px`,
                    animationDelay: `${(i / shell.tools.length) * -14}s`,
                  } as React.CSSProperties}
                >
                  {tool}
                </span>
              );
            })}
          </div>
        </div>

        <div className={styles.shellDots}>
          {SHELLS.map((_, i) => (
            <div key={i} className={`${styles.shellDot} ${i === activeShell ? styles.shellDotActive : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
