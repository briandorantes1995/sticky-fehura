import { useSpring } from '../providers/spring-provider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function SpringSwitcher() {
  const { isSpringMode, toggleSpringMode } = useSpring();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleSpringMode}
            className={`
              flex items-center justify-center h-8 w-8
              rounded-full border-2 transition-all
              ${isSpringMode ? 
                'bg-spring-pink border-spring-green hover:bg-spring-green animate-bloom' : 
                'bg-white border-border hover:border-spring-pink dark:border-darkBorder dark:bg-secondaryBlack'
              }
            `}
          >
            <span className="text-xl">{isSpringMode ? '🌸' : '🌿'}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSpringMode ? 'Disable' : 'Enable'} Spring mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

