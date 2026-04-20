import { useState, useEffect } from "react";
import "./LoveLetter.css";

const CORRECT_NAME = "April Grace Buba";

export default function LoveLetter() {
  const [inputName, setInputName] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shake, setShake] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  useEffect(() => {
    if (unlocked) {
      setTimeout(() => setLetterVisible(true), 200);
    }
  }, [unlocked]);

  const handleSubmit = () => {
    const trimmed = inputName.trim();
    if (trimmed.toLowerCase() === CORRECT_NAME.toLowerCase()) {
      setError("");
      setUnlocked(true);
    } else {
      setError("Incorrect name. Please try again.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  /* ── LOVE LETTER SCREEN ── */
  if (unlocked) {
    return (
      <div className={`letter-page ${letterVisible ? "letter-visible" : ""}`}>
        <div className="paper-texture" />
        <div className="letter-container">
          <div className="wax-seal">❦</div>
          <div className="letter-header">
            <div className="flourish">✦ ── ✦ ── ✦</div>
          </div>

          <div className="letter-body">
            <p className="salutation">Mahal,</p>

            <p>
              Maniniwala ka kaya kung aking ihahayag na ang pag-ibig ko sa iyo
              ay higit pa sa iyong inaakala?
            </p>
            <p>
              Sa unang pagkakakilala pa lamang natin, ako'y lubos nang nahulog
              sa iyo. Hindi ko maipaliwanag kung bakit o sa paanong paraan ito
              nagsimula, datapwat ang tanging batid ng aking puso ay ikaw. Sa
              paglipas ng mga araw, ikaw na ang laging laman ng aking isipan at
              ang pangalang palaging binibigkas ng aking mga labi.
            </p>
            <p>
              Noong una, inakala kong ito'y simpleng galak lamang ng pagkakaroon
              ng bagong kaibigan. Ngunit habang tumatagal, ikaw ay naging bahagi
              na ng aking katauhan na tila ba hindi na maiaalis. Ikaw ay lagi
              kong hinahanap, na para bang may kung anong mahimalang puwersa ang
              patuloy na humahatak sa akin patungo sa iyo, na wari ko'y nabihag
              ng isang sumpang hindi ko matakasan. At sa bawat mensaheng iyong
              ipinapadala, kahit ito'y may halong pagbibiro at panunukso, hindi
              ko mapigilang mapangiti. Sapagkat sa likod nito, naroon ang saya
              na ikaw ay akin nakakausap.
            </p>
            <p>
              Kahit tayo ay magkalayo at hindi pa nagkikita, nananatiling buo at
              tapat ang aking damdamin para sa iyo. Hindi hadlang ang layo upang
              maglaho ang aking nararamdaman, sapagkat sa bawat araw, ikaw pa
              rin ang tangi kong mamahalin.
            </p>
            <p>
              Sana ay huwag mong pagdudahan ang nararamdaman ko sa iyo, sapagkat
              ito ay hindi bunga ng panandaliang damdamin lamang kundi isang
              tapat na pinanghahawakan ng aking puso. Hindi ko ito sinimulan
              nang walang katotohanan, at hindi ko rin ito pinapadalos-dalos nang
              walang lalim.
            </p>
            <p>
              Alam kong hindi madali ang maniwala agad, ngunit nais kong
              iparamdam sa iyo na sa bawat salitang aking binibitawan ay naroon
              ang aking katapatan. Hinding-hindi ko gagamitin ang damdaming ito
              upang manakit o maglaro lamang ng emosyon.
            </p>
            <p>
              Nais ko lamang na maramdaman mo ang kapanatagan, na sa kabila ng
              lahat, ako ay totoo sa iyo. Nawa'y unti-unti mong makita na ang
              aking hangarin ay hindi lamang basta pagmamahal, kundi pag-aalaga,
              pag-unawa, at pananatili, kahit sa mga sandaling mahirap intindihin
              ang lahat.
            </p>

            <div className="closing">
              <p>Nagmamahal,</p>
              <p className="signature">Jean ♡</p>
            </div>
          </div>

          <div className="letter-footer">
            <div className="flourish">✦ ── ✦ ── ✦</div>
          </div>

          <div className="corner top-left">❧</div>
          <div className="corner top-right">❧</div>
          <div className="corner bottom-left">❧</div>
          <div className="corner bottom-right">❧</div>
        </div>

        <div className="petals">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`petal petal-${i}`}>🌹</div>
          ))}
        </div>
      </div>
    );
  }

  /* ── SURVEY FORM SCREEN ── */
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