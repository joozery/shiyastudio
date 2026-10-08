"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function useProjectsMotion(root: RefObject<HTMLElement | null>, signature: string) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    const scenes = [...element.querySelectorAll<HTMLElement>('[data-project-scene]')];
    const hero = element.querySelector<HTMLElement>('[data-project-hero]');
    const update = () => {
      const viewport = window.innerHeight;
      element.dataset.motion = String(!motion.matches);
      if (hero) {
        const bounds = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
        hero.style.setProperty('--hero-progress', String(motion.matches ? 0 : progress));
      }
      scenes.forEach(scene => {
        const bounds = scene.getBoundingClientRect();
        if (bounds.bottom < -100 || bounds.top > viewport + 100) return;
        const progress = Math.max(0, Math.min(1, (viewport - bounds.top) / (viewport + bounds.height)));
        scene.style.setProperty('--scene-progress', String(progress));
        const entrance = Math.max(0, Math.min(1, (viewport * 0.95 - bounds.top) / (viewport * 0.55)));
        const eased = 1 - Math.pow(1 - entrance, 3);
        scene.style.setProperty('--scene-reveal', String(motion.matches ? 1 : eased));
        scene.style.setProperty('--parallax-y', `${motion.matches ? 0 : (progress - 0.5) * (viewport < 768 ? 90 : 180)}px`);
        scene.dataset.active = String(bounds.top < viewport * 0.65 && bounds.bottom > viewport * 0.35);
      });
    };
    const sync = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!motion.matches) {
        lenis = new Lenis({
          autoRaf: true,
          lerp: 0.12,
          smoothWheel: true,
          syncTouch: false,
          anchors: { offset: -90 },
          prevent: node => !!node.closest('dialog, [data-lenis-prevent]'),
        });
        lenis.on('scroll', update);
        if (document.body.style.overflow === 'hidden') lenis.stop();
      }
      update();
    };
    // Keep body scroll locking in sync with the shared mobile navigation.
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === 'hidden') lenis?.stop();
      else lenis?.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    sync();
    motion.addEventListener('change', sync);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      lenis?.destroy();
      observer.disconnect();
      motion.removeEventListener('change', sync);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [root, signature]);
}
