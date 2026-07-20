const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';/, "import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from 'motion/react';");

// Replace Counter
const counterOld = `const Counter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(value);
      return;
    }

    const duration = 2000;
    const range = end - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * range + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value]);

  return <span>{count}{suffix}</span>;
};`;

const counterNew = `const Counter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (inView) {
      const animation = animate(count, value, { duration: 2, ease: "easeOut" });
      return animation.stop;
    }
  }, [inView, value, count]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
};`;

code = code.replace(counterOld, counterNew);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed Counter');
