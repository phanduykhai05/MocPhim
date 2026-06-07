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
  { size: 80,  top: "6%",  left: "10%", color: "white",  dur: 10, delay: 0   },
  { size: 52,  top: "22%", left: "62%", color: "silver", dur: 12, delay: -3  },
  { size: 88,  top: "44%", left: "5%",  color: "gray",   dur: 14, delay: -6  },
  { size: 60,  top: "60%", left: "55%", color: "dark",   dur: 11, delay: -2  },
  { size: 64,  top: "75%", left: "25%", color: "white",  dur: 13, delay: -8  },
  { size: 44,  top: "15%", left: "38%", color: "silver", dur: 15, delay: -5  },
];

export default function AuthDecor() {
  return (
    <div className={styles.panel}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

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
