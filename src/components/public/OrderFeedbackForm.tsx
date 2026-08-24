import React, { useState, useCallback } from 'react';
import { Star, MessageSquare, Check, Sparkles, Edit3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Order, OrderReview } from '../../types';

interface OrderFeedbackFormProps {
  order: Order;
  onSubmitReview: (orderId: string, rating: number, feedback: string) => void;
  compact?: boolean;
}

const RATING_LABELS: Record<number, { en: string; bn: string }> = {
  5: { en: 'Excellent / Outstanding', bn: 'চমৎকার ও দ্রুততম সেবা' },
  4: { en: 'Very Good Quality', bn: 'খুব ভালো মান ও সার্ভিস' },
  3: { en: 'Satisfactory / Average', bn: 'মোটামুটি সন্তোষজনক' },
  2: { en: 'Below Expectation', bn: 'প্রত্যাশার চেয়ে কম' },
  1: { en: 'Disappointing', bn: 'হতাশাজনক অভিজ্ঞতা' }
};

export const OrderFeedbackForm: React.FC<OrderFeedbackFormProps> = React.memo(({
  order,
  onSubmitReview,
  compact = false
}) => {
  const { language } = useLanguage();
  const existingReview = order.review;

  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(existingReview?.feedback || '');
  const [isEditing, setIsEditing] = useState<boolean>(!existingReview);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const activeStarCount = hoverRating > 0 ? hoverRating : rating;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    setIsSubmitting(true);
    onSubmitReview(order.id, rating, feedback);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSubmitSuccess(false), 3500);
    }, 300);
  }, [order.id, rating, feedback, onSubmitReview]);

  // If review exists and not currently editing, display the verified review badge
  if (existingReview && !isEditing) {
    return (
      <div className={`p-4 rounded-2xl bg-neutral-900/90 border border-emerald-500/30 space-y-3 ${compact ? 'text-xs' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="text-xs font-bold text-white block">
                {language === 'bn' ? 'আপনার জমা দেওয়া রিভিউ' : 'Your Verified Order Review'}
              </span>
              <span className="text-[10px] text-neutral-400">
                {new Date(existingReview.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-neutral-300 hover:text-white flex items-center gap-1 border border-neutral-700 transition-colors"
          >
            <Edit3 className="w-3 h-3 text-emerald-400" />
            <span>{language === 'bn' ? 'রিভিউ পরিবর্তন' : 'Edit Review'}</span>
          </button>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(starVal => (
              <Star
                key={starVal}
                className={`w-4 h-4 ${
                  starVal <= existingReview.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-extrabold text-amber-400 font-mono">
            {existingReview.rating}.0 / 5.0
          </span>
          <span className="text-[11px] text-neutral-400">
            • {RATING_LABELS[existingReview.rating]?.[language === 'bn' ? 'bn' : 'en']}
          </span>
        </div>

        {/* Feedback text */}
        {existingReview.feedback && (
          <p className="text-xs text-neutral-300 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 italic">
            "{existingReview.feedback}"
          </p>
        )}

        {submitSuccess && (
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'রিভিউ সফলভাবে সংরক্ষিত হয়েছে!' : 'Review updated successfully!'}</span>
          </div>
        )}
      </div>
    );
  }

  // Interactive Form to submit or edit review
  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 sm:p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4 ${
        compact ? 'text-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-4 h-4 fill-amber-400/30" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-bold text-white">
              {language === 'bn' ? 'পণ্য ও সার্ভিসের ওপর আপনার মতামত দিন' : 'Rate Your Purchase Experience'}
            </h5>
            <p className="text-[11px] text-neutral-400">
              {language === 'bn'
                ? 'ডেলিভারিকৃত কাগজ বা সেবার অভিজ্ঞতা জানিয়ে রেটিং দিন।'
                : 'Share your feedback on the delivered products and service quality.'}
            </p>
          </div>
        </div>

        {existingReview && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 underline"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
        )}
      </div>

      {/* Star Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider block">
          {language === 'bn' ? 'স্টার রেটিং নির্ধারণ করুন:' : 'Select Star Rating:'}
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800">
            {[1, 2, 3, 4, 5].map(starNum => {
              const isFilled = starNum <= activeStarCount;
              return (
                <button
                  key={starNum}
                  type="button"
                  onClick={() => setRating(starNum)}
                  onMouseEnter={() => setHoverRating(starNum)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg hover:scale-115 transition-transform text-neutral-600 focus:outline-none"
                  title={`${starNum} Star`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-neutral-700 hover:text-neutral-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="text-xs font-semibold text-neutral-300">
            <span className="text-amber-400 font-bold mr-1.5 font-mono">{activeStarCount}.0 / 5.0</span>
            <span className="text-neutral-400">
              ({RATING_LABELS[activeStarCount]?.[language === 'bn' ? 'bn' : 'en']})
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Textarea */}
      <div className="space-y-1.5">
        <label className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'আপনার মূল্যবান মন্তব্য (ঐচ্ছিক):' : 'Written Feedback (Optional):'}</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-mono font-normal">
            {feedback.length}/300
          </span>
        </label>
        <textarea
          rows={2}
          maxLength={300}
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'কাগজের কোয়ালিটি, জিএসএম নির্ভুলতা বা ডেলিভারির অভিজ্ঞতা লিখুন...'
              : 'Write your thoughts on paper quality, packaging, delivery speed, or printing...'
          }
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-neutral-500">
          {language === 'bn' ? '✓ ভেরিফাইড ক্রেতার রিভিউ' : '✓ Verified Purchase Feedback'}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating < 1}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all hover:scale-105 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>{language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}</span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
});

OrderFeedbackForm.displayName = 'OrderFeedbackForm';
