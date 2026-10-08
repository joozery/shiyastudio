"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls } from "motion/react";
import Image from "next/image";
import styles from "./PageTransition.module.css";

const isAdmin = (path: string) => /\/(?:admin)(?:\/|$)/.test(path);

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const controls = useAnimationControls();
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const origin = useRef(pathname);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timeout.current) clearTimeout(timeout.current); };
  }, []);

  useEffect(() => {
    const reveal = async () => {
      if (!busy.current || pathname === origin.current) return;
      if (timeout.current) clearTimeout(timeout.current);
      await controls.start({ y: '-100%', transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } });
      if (!mounted.current) return;
      controls.set({ y: '100%' });
      busy.current = false;
      setActive(false);
    };
    void reveal();
  }, [pathname, controls]);

  useEffect(() => {
    const click = async (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!anchor || anchor.download || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('data-no-transition')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol) || isAdmin(pathname) || isAdmin(url.pathname)) return;
      // Anchor jumps, searches and links to the current page retain normal navigation.
      if (url.pathname === location.pathname || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      origin.current = pathname;
      setActive(true);
      router.prefetch(url.pathname + url.search);
      await controls.start({ y: '0%', transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } });
      if (!mounted.current) return;
      timeout.current = setTimeout(() => {
        // Restore interaction if a navigation fails or is cancelled.
        void controls.start({ y: '-100%', transition: { duration: 0.3 } }).then(() => {
          if (!mounted.current) return;
          controls.set({ y: '100%' });
          busy.current = false;
          setActive(false);
        });
      }, 15000);
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [pathname, router, controls]);

  return <motion.div className={styles.overlay} initial={{ y: '100%' }} animate={controls} style={{ pointerEvents: active ? 'auto' : 'none' }} aria-hidden="true">
    <div className={styles.glow}/><div className={styles.brand}><Image src="/logo/logo.png" alt="" width={96} height={96} priority/><span>SHIYA STUDIO</span><small>IDEAS. CONTENT. PEOPLE. IMPACT.</small></div>
    <span className={styles.label}>CREATIVE STUDIO / BANGKOK</span>
  </motion.div>;
}
