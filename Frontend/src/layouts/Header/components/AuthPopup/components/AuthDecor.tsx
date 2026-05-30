import styles from "./AuthDecor.module.scss";

type BallColor = "white" | "silver" | "gray" | "dark";

interface BallDef {
  size: number;
  top: string;
  left: string;
  color: BallColor;
  dur: number;
  delay: number;
}

const BALLS: BallDef[] = [
  { size: 80,  top: "6%",  left: "10%", color: "white",  dur: 8,  delay: 0    },
  { size: 52,  top: "18%", left: "62%", color: "silver", dur: 7,  delay: -2   },
  { size: 92,  top: "42%", left: "4%",  color: "gray",   dur: 10, delay: -5   },
  { size: 60,  top: "35%", left: "55%", color: "dark",   dur: 9,  delay: -1.5 },
  { size: 68,  top: "62%", left: "28%", color: "white",  dur: 11, delay: -3   },
  { size: 44,  top: "70%", left: "68%", color: "silver", dur: 8,  delay: -4   },
  { size: 84,  top: "76%", left: "12%", color: "gray",   dur: 12, delay: -7   },
  { size: 48,  top: "12%", left: "38%", color: "white",  dur: 9,  delay: -6   },
  { size: 36,  top: "50%", left: "78%", color: "dark",   dur: 7,  delay: -8   },
  { size: 56,  top: "88%", left: "45%", color: "silver", dur: 13, delay: -2.5 },
];

export default function AuthDecor() {
  return (
    <div className={styles.panel}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {BALLS.map((b, i) => (
        <div
          key={i}
          className={`${styles.ball} ${styles[b.color]}`}
          style={{
            width:             b.size,
            height:            b.size,
            top:               b.top,
            left:              b.left,
            animationDuration: `${b.dur}s`,
            animationDelay:    `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
