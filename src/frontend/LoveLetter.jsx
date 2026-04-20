import { useState, useEffect, useRef } from "react";
import "./LoveLetter.css";

const CORRECT_NAME = "April Grace Buba";

// Typing speeds
const SALUTATION_SPEED = 120; // ms per char for "Mahal,"
const PARA_SPEED = 36;        // ms per char for paragraphs (slow & flowing)

// Pauses
const INITIAL_WAIT   = 5000; // wait before typing "Mahal,"
const AFTER_MAHAL    = 2000; // wait after "Mahal," before first paragraph
const BETWEEN_BLOCKS = 3000; // wait between every other block

const FULL_TEXT = [
  { type: "salutation", text: "Mahal," },
  { type: "para", text: "Maniniwala ka kaya kung aking ihahayag na ang pag-ibig ko sa iyo ay higit pa sa iyong inaakala?" },
  { type: "para", text: "Sa unang pagkakakilala pa lamang natin, ako'y lubos nang nahulog sa iyo. Hindi ko maipaliwanag kung bakit o sa paanong paraan ito nagsimula, datapwat ang tanging batid ng aking puso ay ikaw. Sa paglipas ng mga araw, ikaw na ang laging laman ng aking isipan at ang pangalang palaging binibigkas ng aking mga labi." },
  { type: "para", text: "Noong una, inakala kong ito'y simpleng galak lamang ng pagkakaroon ng bagong kaibigan. Ngunit habang tumatagal, ikaw ay naging bahagi na ng aking katauhan na tila ba hindi na maiaalis. Ikaw ay lagi kong hinahanap, na para bang may kung anong mahimalang puwersa ang patuloy na humahatak sa akin patungo sa iyo, na wari ko'y nabihag ng isang sumpang hindi ko matakasan. At sa bawat mensaheng iyong ipinapadala, kahit ito'y may halong pagbibiro at panunukso, hindi ko mapigilang mapangiti. Sapagkat sa likod nito, naroon ang saya na ikaw ay akin nakakausap." },
  { type: "para", text: "Kahit tayo ay magkalayo at hindi pa nagkikita, nananatiling buo at tapat ang aking damdamin para sa iyo. Hindi hadlang ang layo upang maglaho ang aking nararamdaman, sapagkat sa bawat araw, ikaw pa rin ang tangi kong mamahalin." },
  { type: "para", text: "Sana ay huwag mong pagdudahan ang nararamdaman ko sa iyo, sapagkat ito ay hindi bunga ng panandaliang damdamin lamang kundi isang tapat na pinanghahawakan ng aking puso. Hindi ko ito sinimulan na walang katotohanan, at hindi ko rin ito pinapadalos-dalos na walang lalim." },
  { type: "para", text: "Alam kong hindi madali ang maniwala agad, ngunit nais kong iparamdam sa iyo na sa bawat salitang aking binibitawan ay naroon ang aking katapatan. Hinding-hindi ko gagamitin ang damdaming ito upang manakit o maglaro lamang ng emosyon." },
  { type: "para", text: "Nais ko lamang na maramdaman mo ang kapanatagan, na sa kabila ng lahat, ako ay totoo sa iyo. Nawa'y unti-unti mong makita na ang aking hangarin ay hindi lamang basta pagmamahal, kundi pag-aalaga, pag-unawa, at pananatili, kahit sa mga sandaling mahirap intindihin ang lahat." },
  { type: "closing",   text: "Nagmamahal," },
  { type: "signature", text: "Jean" },
];

export default function LoveLetter() {
  const [inputName, setInputName]       = useState("");
  const [error, setError]               = useState("");
  const [phase, setPhase]               = useState("form"); // form | loading | letter
  const [loadProgress, setLoadProgress] = useState(0);
  const [shake, setShake]               = useState(false);
  const [fadeIn, setFadeIn]             = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  // Typewriter
  const [visibleBlocks, setVisibleBlocks] = useState([]);
  const [currentBlock, setCurrentBlock]   = useState(-1); // -1 = initial wait
  const [currentChar, setCurrentChar]     = useState(0);
  const [typingDone, setTypingDone]       = useState(false);
  const [isPausing, setIsPausing]         = useState(false);

  // Music
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicReady, setMusicReady]     = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  // ── Loading progress ──
  useEffect(() => {
    if (phase !== "loading") return;
    setLoadProgress(0);
    const duration = 5000;
    const interval = 50;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setLoadProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setPhase("letter");
            setTimeout(() => setLetterVisible(true), 100);
          }, 400);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [phase]);

  // ── Kick off typewriter once letter is visible ──
  // Start with initial 5-second wait, then move to block 0 (salutation)
  useEffect(() => {
    if (phase !== "letter" || !letterVisible) return;
    const t = setTimeout(() => {
      setCurrentBlock(0);
    }, INITIAL_WAIT);
    return () => clearTimeout(t);
  }, [phase, letterVisible]);

  // ── Typewriter effect ──
  useEffect(() => {
    if (phase !== "letter" || !letterVisible) return;
    if (currentBlock < 0) return; // still in initial wait
    if (currentBlock >= FULL_TEXT.length) {
      setTypingDone(true);
      return;
    }
    if (isPausing) return;

    const block = FULL_TEXT[currentBlock];

    if (currentChar < block.text.length) {
      const speed = block.type === "salutation" ? SALUTATION_SPEED : PARA_SPEED;
      const t = setTimeout(() => {
        setVisibleBlocks((prev) => {
          const updated = [...prev];
          if (!updated[currentBlock]) {
            updated[currentBlock] = { ...block, display: "" };
          }
          updated[currentBlock] = {
            ...block,
            display: block.text.slice(0, currentChar + 1),
          };
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      // Block done — choose the right pause
      setIsPausing(true);
      const pause = currentBlock === 0 ? AFTER_MAHAL : BETWEEN_BLOCKS;
      const t = setTimeout(() => {
        setIsPausing(false);
        setCurrentBlock((b) => b + 1);
        setCurrentChar(0);
      }, pause);
      return () => clearTimeout(t);
    }
  }, [phase, letterVisible, currentBlock, currentChar, isPausing]);

  // ── Music setup ──
  useEffect(() => {
    if (phase === "letter" && audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.loop = true;
      audioRef.current.play()
        .then(() => { setMusicPlaying(true); setMusicReady(true); })
        .catch(() => { setMusicReady(true); });
    }
  }, [phase]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); }
    else              { audioRef.current.play();  setMusicPlaying(true);  }
  };

  const handleSubmit = () => {
    const trimmed = inputName.trim();
    if (trimmed.toLowerCase() === CORRECT_NAME.toLowerCase()) {
      setError("");
      setPhase("loading");
    } else {
      setError("Incorrect name. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  // ── LOADING SCREEN ──
  if (phase === "loading") {
    return (
      <div className="loading-page">
        <div className="loading-card">
          <div className="loading-hearts">
            <span className="lh lh1">♡</span>
            <span className="lh lh2">♡</span>
            <span className="lh lh3">♡</span>
          </div>
          <p className="loading-text">Preparing something special...</p>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${loadProgress}%` }} />
          </div>
          <p className="loading-pct">{Math.floor(loadProgress)}%</p>
        </div>
      </div>
    );
  }

  // ── LETTER SCREEN ──
  if (phase === "letter") {
    return (
      <div className={`letter-page ${letterVisible ? "letter-visible" : ""}`}>
        <audio ref={audioRef} src="/music/bgmusic.mp3" preload="auto" />
        {musicReady && (
          <button className="music-btn" onClick={toggleMusic} title="Toggle music">
            {musicPlaying ? "🎵" : "🔇"}
          </button>
        )}

        {/* Fixed dark background — never moves */}
        <div className="page-bg" />
        <div className="paper-texture" />

        <div className="letter-container">
          <div className="wax-seal">❦</div>
          <div className="letter-header">
            <div className="flourish">✦ ── ✦ ── ✦</div>
          </div>

          <div className="letter-body">
            {visibleBlocks.map((block, i) => {
              if (!block) return null;
              const isActive = i === currentBlock && !typingDone && !isPausing;

              if (block.type === "salutation") {
                // Cursor only while actively typing salutation
                const stillTypingSalutation = currentBlock === 0 && !isPausing && !typingDone;
                return (
                  <p key={i} className="salutation">
                    {block.display}
                    {stillTypingSalutation && <span className="cursor">|</span>}
                  </p>
                );
              }
              if (block.type === "closing") {
                return (
                  <div key={i} className="closing">
                    <p>{block.display}{isActive && <span className="cursor">|</span>}</p>
                  </div>
                );
              }
              if (block.type === "signature") {
                return (
                  <div key={i} className="closing">
                    <p className="signature">{block.display}{isActive && <span className="cursor">|</span>}</p>
                  </div>
                );
              }
              return (
                <p key={i}>
                  {block.display}
                  {isActive && <span className="cursor">|</span>}
                </p>
              );
            })}
          </div>

          {typingDone && (
            <>
              <div className="letter-footer">
                <div className="flourish">✦ ── ✦ ── ✦</div>
              </div>
              <div className="corner top-left">❧</div>
              <div className="corner top-right">❧</div>
              <div className="corner bottom-left">❧</div>
              <div className="corner bottom-right">❧</div>
            </>
          )}
        </div>

        <div className="petals">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`petal petal-${i}`}>🌹</div>
          ))}
        </div>
      </div>
    );
  }

  // ── SURVEY FORM ──
  return (
    <div className={`survey-page ${fadeIn ? "survey-visible" : ""}`}>
      <div className="survey-card">
        <div className={`survey-inner ${shake ? "shake" : ""}`}>
          <div className="survey-header">
            <div className="survey-icon">📋</div>
            <h1 className="survey-title">Survey Form</h1>
            <p className="survey-desc">Please fill in your information below to continue.</p>
          </div>
          <div className="survey-divider" />
          <div className="survey-field">
            <label className="survey-label" htmlFor="fullname">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullname"
              className="survey-input"
              type="text"
              placeholder="Enter your full name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            {error && (
              <p className="survey-error">
                <span className="error-icon">⚠</span> {error}
              </p>
            )}
          </div>
          <button className="survey-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}