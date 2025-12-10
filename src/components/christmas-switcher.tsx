import { useChristmas } from '../providers/christmas-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function ChristmasSwitcher() {
  const { isChristmasMode, toggleChristmasMode } = useChristmas();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleChristmasMode}
            className={`
              flex items-center justify-center h-8 w-8
              rounded-full border-2 transition-all
              ${isChristmasMode ? 
                'bg-christmas-red border-christmas-gold hover:bg-christmas-gold animate-sparkle' : 
                'bg-white border-border hover:border-christmas-red dark:border-darkBorder dark:bg-secondaryBlack'
              }
            `}
          >
            <span className="text-xl">{isChristmasMode ? '🎄' : '🎅'}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isChristmasMode ? 'Disable' : 'Enable'} Christmas mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

