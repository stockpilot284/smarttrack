import { delay, easeInOut, easeOut, spring, Variants } from 'framer-motion'

/**
 * Usage:
 * <motion.div {...motionPresets.fadeSlide} />
 * <motion.div variants={motionPresets.scaleIn} />
 */

export const motionPresets = {
  /** 1️⃣ Smooth fade + slide (default UI) */
  fadeSlide: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: {
      type: spring,
      stiffness: 260,
      damping: 24,
    },
  },

  /** 2️⃣ Soft fade (helper text, hints) */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.2,
      ease: easeInOut,
    },
  },

  /** 3️⃣ Scale in (modals, popovers) */
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: {
      type: spring,
      stiffness: 300,
      damping: 26,
    },
  },

  /** 4️⃣ Slide from bottom (drawers) */
  slideUp: {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 16, opacity: 0 },
    transition: {
      type: spring,
      stiffness: 280,
      damping: 30,
    },
  },

  /** 5️⃣ Slide from right (pages / panels) */
  slideRight: {
    initial: { x: 32, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 24, opacity: 0 },
    transition: {
      type: spring,
      stiffness: 260,
      damping: 28,
    },
  },

  /** 6️⃣ Subtle lift (hover cards) */
  lift: {
    whileHover: {
      y: -4,
      transition: {
        type: spring,
        stiffness: 300,
        damping: 20,
      },
    },
  },

  /** 7️⃣ Press feedback (buttons) */
  press: {
    whileTap: {
      scale: 0.97,
    },
  },

  /** 8️⃣ Stagger container (lists) */
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  },

  /** 9️⃣ Stagger item (list rows) */
  staggerItem: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: {
      type: spring,
      stiffness: 260,
      damping: 24,
    },
  },

  /** 🔟 Shake (validation error) */
  shake: {
    animate: {
      x: [-4, 4, -3, 3, -2, 2, 0],
      transition: {
        duration: 0.4,
      },
    },
  },

  /** 🔽 Slide up when in view (runs once) */
  inViewSlideUp: {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: {
      type: spring,
      stiffness: 220,
      damping: 26,
    },
  },

  /** 🔽 Subtle in-view fade up (text blocks) */
  inViewFadeUp: {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    exit: { opacity: 0, y: 12 },
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },

  fadeSlideRight: {
    initial: { x: 16, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 16, opacity: 0 },
    transition: {
      duration: 0.5,
      ease: easeInOut,
    },
  },
} satisfies Record<string, Variants | any>
