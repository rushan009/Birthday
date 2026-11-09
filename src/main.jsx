import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const AGE = 19;
const PHOTOS = [
  ["IMG-20250619-WA0015.jpg", "A favorite moment"],
  ["IMG-20250711-WA0013.jpg", "A day worth remembering"],
  ["IMG_20250402_111318_560.jpg", "Little pieces of us"],
  ["IMG_20250412_065843_681.jpg", "One for the memory box"],
  ["IMG_20250530_124956_797.jpg", "The good days"],
  ["IMG_20251029_184127_291.jpg", "Always making memories"],
  ["IMG_20260410_174441.jpg", "A beautiful chapter"],
  ["Screenshot_2025-11-16-10-39-32-389_com.openai.chatgpt-edit.jpg", "One more favorite"],
];
const NOTES = [
  ["Open when you feel tired", "You are doing well ani I am proud of you"],
  ["Open when you need a smile", "I hope this little page reminds you how loved you are."],
  ["Open when you miss me", "Hami sangai ta chau ni"],
  ["Open on a quiet night", "I hope mero yeti effort ley halka vaye ni khusi vayeu hola."],
];

function Intro({ onOpen }) {
  const [opening, setOpening] = useState(false);
  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 1800);
  };
  return (
    <div className={`intro ${opening ? "intro-open" : ""}`}>
      <div className="intro-content">
        <div className="envelope"><i className="envelope-back" /><i className="envelope-card">19</i><i className="envelope-front" /><i className="envelope-flap" /></div>
        <h1>For <span>you</span></h1>
        <p>Something small is waiting inside.</p>
        <button onClick={open} disabled={opening}>Open your surprise</button>
      </div>
    </div>
  );
}

function Cake({ onCut }) {
  const [out, setOut] = useState([]);
  const [celebrating, setCelebrating] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [cut, setCut] = useState(false);
  const [blowing, setBlowing] = useState(false);
  const blowTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(blowTimer.current), []);
  const blowOut = (index) => setOut((current) => {
    if (current.includes(index)) return current;
    const next = [...current, index];
    if (next.length === AGE) {
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 4200);
    }
    return next;
  });
  const blowAll = () => {
    if (blowing || remaining === 0) return;
    const remainingCandles = Array.from({ length: AGE }, (_, index) => index).filter((index) => !out.includes(index));
    setBlowing(true);
    remainingCandles.forEach((index, position) => {
      window.setTimeout(() => setOut((current) => current.includes(index) ? current : [...current, index]), position * 180);
    });
    blowTimer.current = window.setTimeout(() => {
      setBlowing(false);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 4200);
    }, remainingCandles.length * 180 + 120);
  };
  const cutCake = () => {
    if (remaining || cutting || cut) return;
    setCutting(true);
    window.setTimeout(() => {
      setCut(true);
      setCutting(false);
      onCut();
    }, 1700);
  };
  const remaining = AGE - out.length;
  return (
    <section className="cake-section" id="cake">
      <h2>Make a wish</h2>
      <p>Think of it quietly. Then tap the candles, or blow them all out at once.</p>
      <div className={`cake ${cut ? "cake-cut" : ""} ${cutting ? "cake-cutting" : ""}`}>
        <div className="candles">{Array.from({ length: AGE }, (_, index) => <button aria-label={`Candle ${index + 1}`} className={`candle ${out.includes(index) ? "out" : ""}`} key={index} disabled={blowing} onClick={() => blowOut(index)} />)}</div>
        <div className="tier tier-small" /><div className="tier tier-large" /><div className="plate" />
        {cutting && <div className="knife" aria-hidden="true" />}
      </div>
      <p className="wish" aria-live="polite">{remaining ? `${remaining} little flames are still glowing…` : "Your wish is on its way. Happy birthday, mayalu."}</p>
      <div className="cake-actions"><button onClick={blowAll} disabled={blowing || remaining === 0}>{blowing ? "Blowing out…" : remaining === AGE ? "Blow out the candles" : "Blow out the rest"}</button>{remaining === 0 && !cut && <button className="cut-button" onClick={cutCake}>Cut the birthday cake ✦</button>}{remaining < AGE && remaining > 0 && <button className="soft-button" disabled={blowing} onClick={() => { window.clearTimeout(blowTimer.current); setBlowing(false); setOut([]); }}>Relight them</button>}</div>
      {cut && <p className="cut-complete">The cake is cut. Your birthday memories are ready.</p>}
      {celebrating && <Celebration />}
    </section>
  );
}

function Celebration() {
  return <div className="celebration" aria-hidden="true">{Array.from({ length: 42 }, (_, index) => <i key={index} style={{ "--x": `${(index % 14) * 7.7 + 4}%`, "--y": `${10 + (index % 5) * 16}%`, "--delay": `${(index % 7) * 0.08}s`, "--hue": `${index * 23 % 360}` }} />)}</div>;
}

function Gallery() {
  const [selected, setSelected] = useState(null);
  const [shuffled, setShuffled] = useState(false);
  const [photos, setPhotos] = useState(PHOTOS);
  const move = (offset) => setSelected((current) => (current + offset + photos.length) % photos.length);
  const shuffle = () => {
    setPhotos((current) => [...current].sort(() => Math.random() - 0.5));
    setShuffled(true);
    setSelected(null);
  };
  useEffect(() => {
    const onKey = (event) => {
      if (selected === null) return;
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, photos]);
  return (
    <section id="memories">
      <div className="section-heading"><div><p className="eyebrow">Pinned with love</p><h2>Little pieces of us</h2><p>Move your cursor over a photograph, then open the ones that make you smile.</p></div><button className="soft-button shuffle-button" onClick={shuffle}>{shuffled ? "Shuffle again ↗" : "Shuffle the wall ↗"}</button></div>
      <div className="photo-wall">{photos.map(([src, caption], index) => <figure className="photo" key={src} onClick={() => setSelected(index)}><div className="pin" /><div className="photo-tape" /><div className="photo-frame"><img src={`/${src}`} alt={caption} loading="lazy" /><span className="photo-number">0{index + 1}</span><span className="photo-hover">Open memory</span></div><figcaption>{caption}</figcaption></figure>)}</div>
      {selected !== null && <div className="lightbox" role="dialog" aria-modal="true" onClick={(event) => event.target === event.currentTarget && setSelected(null)}>
        <button className="lightbox-close" aria-label="Close" onClick={() => setSelected(null)}>×</button>
        <button className="lightbox-nav previous" aria-label="Previous" onClick={() => move(-1)}>‹</button>
        <div className="lightbox-content"><p className="eyebrow">Memory {String(selected + 1).padStart(2, "0")}</p><img src={`/${photos[selected][0]}`} alt={photos[selected][1]} /><p>{photos[selected][1]}</p></div>
        <button className="lightbox-nav next" aria-label="Next" onClick={() => move(1)}>›</button>
      </div>}
    </section>
  );
}

function Letter() {
  const [open, setOpen] = useState(false);
  return <section className="letter-section"><h2>A letter for you</h2><p>Tap the seal.</p><div className={`paper ${open ? "paper-open" : ""}`} role="button" tabIndex="0" onClick={() => setOpen(true)} onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && setOpen(true)}><div className="seal">♡</div><div className="letter-text"><p>First of all, Happy Birthday my love. Priya timi Bina ma kasari bachxu I can't even imagine. The only thing that I am scared of is losing you. 2 barsa ta katyo aaru ajhai dherai xa.. jasto situation ma Hami xum aailey idk kasari solve hunxa, I am clueless and ik you also are. Tara solve the hamiley nai garney ho.. birthday ko din ni yesto kura Bata start garxu hai ma ta ..</p><p>You are the best thing that have ever happened in my life. Thaha xa even if you stop loving me I can't do same for you. I am attached to you .. even more then myself.</p><p>You love me. You care me . You share everything with me .. eeuta chocolate Pani adhi parxau. Ik I haven't done the same for you. Tara I love you more than you know.</p><p>I hope you live long, yo vanera mailey timro lagi kei mageko Haina I am selfish yk, mailey aafno lagi mageko ho cuz I will be destroyed without you so you need to live longer then me.</p><p className="signature">Timile socheko sabai pura hos mayalu,<br />I love you the most</p></div></div></section>;
}

function Notes() {
  const [open, setOpen] = useState(null);
  return <section><h2>Small notes</h2><p>Open them whenever you need one.</p><div className="notes">{NOTES.map(([title, text], index) => <button className={`note ${open === index ? "note-open" : ""}`} key={title} onClick={() => setOpen(open === index ? null : index)} aria-label={title}><span className="note-base" /><span className="note-message"><small>{title}</small><strong>{text}</strong></span><span className="note-flap" /></button>)}</div></section>;
}

function BirthdayWish() {
  const [revealed, setRevealed] = useState(false);
  return <section className="birthday-wish"><div className={`wish-reveal ${revealed ? "revealed" : ""}`}><p className="eyebrow">The message behind everything</p><h2>{revealed ? "Happy birthday, Baby." : "There is one more thing…"}</h2><div className="wish-message"><p>First thing, Sadhai Sancho hos.</p><p>I love you so much babe. I'm sorry for making you cry so many times, but I promise I'll keep loving you too.</p><p>May we always stay together and We should babe.</p><p>Once again, Happy Birthday! ❤️</p></div><button onClick={() => setRevealed(true)}>{revealed ? "Keep this close ✦" : "Reveal your birthday wish"}</button></div></section>;
}

function Poem() {
  return <section className="poem-section"><p className="eyebrow">For you, in Nepali</p><h2>एउटा सानो कविता</h2><div className="poem-card"><p>स्वीकार्छु मृत्युले अंगाले नी मलाइ,<br />हासिल हुनु पर्यो पर्मायु तिमीलाई<br /><br />म सापटी दिन नी तयार छु मेरो उमेर,<br />जीवन प्राप्त होस् दीर्घायु तिमीलाई<br /><br />यदि सताए तिमीलाई घामले,<br />म उपहारमा पठाउने छु वायु तिमीलाई,<br /><br />तिमी प्रश्न नगर मलाई साथको,<br />म सुम्पिन पनि तयार छु आयु तिमीलाई</p></div></section>;
}

function App() {
  const [introVisible, setIntroVisible] = useState(true);
  const [cakeCut, setCakeCut] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    document.body.classList.toggle("locked", introVisible);
    if (introVisible) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [introVisible]);
  const openSurprise = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setIntroVisible(false);
  };
  const secret = (message) => { setToast(message); window.setTimeout(() => setToast(""), 3600); };
  return <>{introVisible && <Intro onOpen={openSurprise} />}<main>
    <section className="hero"><h1>Happy <span className="number">{AGE}th Birthday</span>,<br />Cutu</h1><p>The day is yours. Take your time, look around, and open everything.</p><button className="secret" onClick={() => secret("You found one. Keep looking, there are more.")}>✦</button></section>
    <Cake onCut={() => setCakeCut(true)} />
    {!cakeCut && <section className="locked-section"><div className="lock-symbol">✦</div><h2>Cut the cake to continue</h2><p>Blow out every candle, then make the first slice.</p></section>}
    {cakeCut && <><BirthdayWish /><Gallery /><Poem /><Letter /><Notes /></>}
  </main><footer>Happy birthday, with love <button className="secret inline-secret" onClick={() => secret("Last one: you are loved, today and every day.")}>✦</button></footer>{toast && <div className="toast">{toast}</div>}</>;
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
