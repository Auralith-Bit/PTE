'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Slide-in navigation drawer for small screens.
 *
 * Rendered only below the `lg` breakpoint (1024px), which matches
 * the Tailwind scale documented at the top of `app/globals.css`.
 * Handles the accessibility bits a hand-rolled drawer usually
 * misses: Escape to dismiss, body scroll lock, focus move on
 * open, and closing itself if the viewport grows past `lg`.
 */
export default function MobileDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Toggle `inert` imperatively rather than as a prop.
  //
  // React 19 promoted `inert` to a real boolean DOM prop, but this app is on
  // React 18, where passing a boolean warns because `inert` is not in the known
  // attribute list. The attribute itself is supported by every browser we
  // target, so setting it directly keeps the behaviour without the warning
  // (and stays correct if the app later moves to React 19).
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (open) el.removeAttribute('inert');
    else el.setAttribute('inert', '');
  }, [open]);

  // Escape to close.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Lock body scroll while open, without the layout shift that
  // comes from the scrollbar disappearing.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open]);

  // Move focus into the drawer on open, and hand it back on close.
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    } else {
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    }
  }, [open]);

  // If the viewport grows past `lg` the desktop nav takes over,
  // so the drawer must not stay open underneath it.
  useEffect(() => {
    if (!open) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    function onChange(e: MediaQueryList | MediaQueryListEvent) {
      if (e.matches) onClose();
    }

    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [open, onClose]);

  // Keep Tab inside the drawer while it is open.
  useEffect(() => {
    if (!open || !panelRef.current) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="lg:hidden" aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(320px,85vw)] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0 visible' : 'translate-x-full invisible pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-[15px] font-extrabold text-gray-900">{title}</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
