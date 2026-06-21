import React from 'react';
import { MessageCircle, LucideIcon, User } from 'lucide-react';
import clsx from 'clsx';

export type PatientStatus = 'new' | 'active' | 'pending';

export interface PatientCardProps {
  id: string | number;
  name: string;
  avatar?: string | null;
  caseType: string;
  message: string;
  status: PatientStatus;
  isOnline?: boolean;
  onAccept?: (id: string | number) => void;
  onReject?: (id: string | number) => void;
  onChat?: (id: string | number) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({
  id,
  name,
  avatar,
  caseType,
  message,
  status,
  isOnline = false,
  onAccept,
  onReject,
  onChat,
}) => {
  const isPendingOrNew = status === 'new' || status === 'pending';

  return (
    <div
      className={clsx(
        'bg-white p-5 rounded-2xl border transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg',
        'focus-within:ring-2 focus-within:ring-primary/50',
        status === 'new'
          ? 'border-blue-100 shadow-sm'
          : 'border-gray-100 shadow-sm'
      )}
    >
      {/* Header with avatar and info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              alt={name}
              className="w-14 h-14 rounded-2xl object-cover"
              src={avatar}
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
              <User className="w-7 h-7" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{caseType}</p>
          </div>
        </div>

        {/* Status badge */}
        {status === 'new' && (
          <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">
            NEW
          </span>
        )}
        {status === 'active' && isOnline && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" aria-hidden="true" />
            Active Now
          </span>
        )}
      </div>

      {/* Message preview */}
      <p className="text-sm text-gray-600 mb-6 line-clamp-2">
        {message}
      </p>

      {/* Action buttons */}
      {isPendingOrNew ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onReject?.(id)}
            className={clsx(
              'py-2.5 rounded-xl border border-gray-200 font-semibold text-sm',
              'text-gray-600 hover:bg-gray-50 hover:border-gray-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'transition-all duration-200'
            )}
          >
            Reject
          </button>
          <button
            onClick={() => onAccept?.(id)}
            className={clsx(
              'py-2.5 rounded-xl bg-primary text-white font-semibold text-sm',
              'hover:bg-blue-600 shadow-md shadow-blue-500/20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'transition-all duration-200'
            )}
          >
            Accept
          </button>
        </div>
      ) : (
        <button
          onClick={() => onChat?.(id)}
          className={clsx(
            'w-full py-2.5 rounded-xl bg-gray-100 text-primary font-semibold text-sm',
            'hover:bg-blue-50 flex items-center justify-center gap-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-all duration-200'
          )}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
      )}
    </div>
  );
};

export default PatientCard;
