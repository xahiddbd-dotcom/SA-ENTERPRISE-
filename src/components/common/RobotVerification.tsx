import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { isDark } = useTheme();
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
      <div className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all ${
        isVerified
          ? isDark
            ? 'border-emerald-500/50 bg-emerald-950/20'
            : 'border-emerald-500 bg-emerald-50/80'
          : isDark
          ? 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
      }`}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            id={`${id}-checkbox-btn`}
            onClick={handleCheckboxClick}
            disabled={isVerifying || isVerified}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
              isVerified
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                : isVerifying
                ? 'border-emerald-500 bg-emerald-500/10'
                : isDark
                ? 'border-neutral-600 hover:border-emerald-400 bg-neutral-900'
                : 'border-slate-300 hover:border-emerald-500 bg-white shadow-2xs'
            }`}
          >
            {isVerifying && (
              <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin" />
            )}
            {isVerified && (
              <Check className="w-4.5 h-4.5 stroke-[3] text-white animate-in zoom-in-50 duration-200" />
            )}
          </button>

          <span
            onClick={!isVerified && !isVerifying ? handleCheckboxClick : undefined}
            className={`text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              isVerified
                ? 'text-emerald-600 dark:text-emerald-400'
                : isDark
                ? 'text-neutral-200 hover:text-white'
                : 'text-slate-800 hover:text-slate-950'
            }`}
          >
            {language === 'bn' ? 'আমি রোবট নই (I am not a robot)' : "I'm not a robot"}
          </span>
        </div>

        {/* reCAPTCHA Branding */}
        <div className={`flex flex-col items-center justify-center text-right pl-3 border-l ${
          isDark ? 'border-neutral-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className={`text-[10px] tracking-wider uppercase font-mono ${
              isDark ? 'text-neutral-400' : 'text-slate-500'
            }`}>
              SE Secure
            </span>
          </div>
          <div className={`text-[9px] flex items-center gap-1 ${
            isDark ? 'text-neutral-400' : 'text-slate-400'
          }`}>
            <span>Privacy</span>
            <span>•</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {/* Optional fallback visual challenge if triggered */}
      {showChallenge && (
        <div className={`p-3.5 border rounded-2xl space-y-2 animate-in fade-in ${
          isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
            {language === 'bn'
              ? `রোবট প্রতিরোধ ভেরিফিকেশন: ${num1} + ${num2} = কত?`
              : `Security Challenge: What is ${num1} + ${num2} ?`}
          </p>
          <form onSubmit={handleChallengeSubmit} className="flex gap-2">
            <input
              type="number"
              value={answerInput}
              onChange={e => setAnswerInput(e.target.value)}
              placeholder="Answer"
              className={`w-24 px-3 py-1.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-500 ${
                isDark ? 'bg-neutral-950 border-neutral-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              {language === 'bn' ? 'যাচাই করুন' : 'Verify'}
            </button>
          </form>
          {challengeError && (
            <span className="text-[11px] text-rose-500 block">
              {language === 'bn' ? 'ভুল উত্তর! আবার চেষ্টা করুন।' : 'Incorrect answer. Please retry.'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
