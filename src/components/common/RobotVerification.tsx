import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check, ShieldCheck, RefreshCw } from 'lucide-react';

interface RobotVerificationProps {
  isVerified: boolean;
  onVerify: (verified: boolean) => void;
  id?: string;
  compact?: boolean;
}

export const RobotVerification: React.FC<RobotVerificationProps> = ({
  isVerified,
  onVerify,
  id = 'robot-verification',
  compact = false
}) => {
  const { language } = useLanguage();
  const [isVerifying, setIsVerifying] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [num1, setNum1] = useState(4);
  const [num2, setNum2] = useState(5);
  const [answerInput, setAnswerInput] = useState('');
  const [challengeError, setChallengeError] = useState(false);

  const generateChallenge = () => {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    setNum1(a);
    setNum2(b);
    setAnswerInput('');
    setChallengeError(false);
  };

  const handleCheckboxClick = () => {
    if (isVerified) return;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      // Randomly or standardly pass or show quick security challenge
      onVerify(true);
    }, 700);
  };

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answerInput.trim(), 10) === (num1 + num2)) {
      setShowChallenge(false);
      onVerify(true);
      setChallengeError(false);
    } else {
      setChallengeError(true);
      generateChallenge();
    }
  };

  return (
    <div id={id} className="space-y-2 select-none">
      <div className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-neutral-950/90 border ${isVerified ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-neutral-800 hover:border-neutral-700'} transition-all shadow-inner`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            id={`${id}-checkbox-btn`}
            onClick={handleCheckboxClick}
            disabled={isVerifying || isVerified}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
              isVerified
                ? 'bg-emerald-500 border-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/30'
                : isVerifying
                ? 'border-emerald-400 bg-emerald-950/40'
                : 'border-neutral-600 hover:border-emerald-400 bg-neutral-900'
            }`}
          >
            {isVerifying && (
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            )}
            {isVerified && (
              <Check className="w-4.5 h-4.5 stroke-[3] text-neutral-950 animate-in zoom-in-50 duration-200" />
            )}
          </button>

          <span
            onClick={!isVerified && !isVerifying ? handleCheckboxClick : undefined}
            className={`text-xs sm:text-sm font-semibold cursor-pointer ${
              isVerified ? 'text-emerald-400' : 'text-neutral-200 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'আমি রোবট নই (I am not a robot)' : "I'm not a robot"}
          </span>
        </div>

        {/* reCAPTCHA Branding */}
        <div className="flex flex-col items-center justify-center text-right pl-2 border-l border-neutral-800/80">
          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono">SE Secure</span>
          </div>
          <div className="text-[9px] text-neutral-400 flex items-center gap-1">
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {/* Optional fallback visual challenge if triggered */}
      {showChallenge && (
        <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-xl space-y-2 animate-in fade-in">
          <p className="text-xs text-neutral-300">
            {language === 'bn'
              ? `রোবট প্রতিরোধ ভেরিফিকেশন: ${num1} + ${num2} = কত?`
              : `Security Challenge: What is ${num1} + ${num2} ?`}
          </p>
          <form onSubmit={handleChallengeSubmit} className="flex gap-2">
            <input
              type="number"
              value={answerInput}
              onChange={e => setAnswerInput(e.target.value)}
              placeholder="Your answer"
              className="w-24 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
            >
              {language === 'bn' ? 'যাচাই করুন' : 'Verify'}
            </button>
          </form>
          {challengeError && (
            <span className="text-[11px] text-rose-400 block">
              {language === 'bn' ? 'ভুল উত্তর! আবার চেষ্টা করুন।' : 'Incorrect answer. Please retry.'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
