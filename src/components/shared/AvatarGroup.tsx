import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarGroupProps {
  avatars: { src: string; alt: string }[];
  max?: number;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'h-6 w-6 text-xs',
  default: 'h-8 w-8 text-sm',
  large: 'h-10 w-10 text-base',
};

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'default',
  className,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          className={cn(
            "rounded-full ring-2 ring-background",
            sizeClasses[size]
          )}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted font-medium ring-2 ring-background",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface UserAvatarProps {
  src?: string;
  name: string;
  showName?: boolean;
  subtitle?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export function UserAvatar({
  src,
  name,
  showName = false,
  subtitle,
  size = 'default',
  className,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full ring-2 ring-border",
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground",
            sizeClasses[size]
          )}
        >
          {initials}
        </div>
      )}
      {showName && (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
