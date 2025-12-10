import React from 'react';
import Logo from '../logo';
import { ThemeSwitcher } from '../theme-switcher';
import { Link } from 'react-router-dom';
import { HalloweenSwitcher } from '../halloween-switcher';
import { ChristmasSwitcher } from '../christmas-switcher';
import { SpringSwitcher } from '../spring-switcher';
import { useHalloween } from '../../providers/halloween-provider';
import { useChristmas } from '../../providers/christmas-provider';
import { useSpring } from '../../providers/spring-provider';

const Footer: React.FC = () => {
  const { isHalloweenMode } = useHalloween();
  const { isChristmasMode } = useChristmas();
  const { isSpringMode } = useSpring();

  const getThemeClasses = () => {
    if (isHalloweenMode) {
      return {
        bg: 'bg-halloween-black/90 text-halloween-ghost',
        logo: 'animate-spooky-shake',
        text: 'text-halloween-orange',
        hover: 'hover:text-halloween-orange',
        footer: 'text-halloween-ghost/80',
        copyright: 'All souls reserved.'
      };
    }
    if (isChristmasMode) {
      return {
        bg: 'bg-christmas-black/90 text-christmas-snow',
        logo: 'animate-sparkle',
        text: 'text-christmas-red',
        hover: 'hover:text-christmas-red',
        footer: 'text-christmas-snow/80',
        copyright: 'All rights reserved. 🎄'
      };
    }
    if (isSpringMode) {
      return {
        bg: 'bg-spring-black/90 text-spring-petal',
        logo: 'animate-bloom',
        text: 'text-spring-pink',
        hover: 'hover:text-spring-pink',
        footer: 'text-spring-petal/80',
        copyright: 'All rights reserved. 🌸'
      };
    }
    return {
      bg: 'bg-white dark:bg-secondaryBlack text-text dark:text-text-dark',
      logo: '',
      text: '',
      hover: 'hover:text-main',
      footer: '',
      copyright: 'All rights reserved.'
    };
  };

  const theme = getThemeClasses();

  return (
    <footer className={theme.bg}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo className={`h-8 w-8 mr-2 ${theme.logo}`} />
            <span className={`text-xl font-bold ${theme.text}`}>Sticky</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/terms" className={`text-sm sm:text-base transition-colors ${theme.hover}`}>Terms</Link>
            <Link to="/privacy" className={`text-sm sm:text-base transition-colors ${theme.hover}`}>Privacy</Link>
            <ThemeSwitcher />
            <HalloweenSwitcher />
            <ChristmasSwitcher />
            <SpringSwitcher />
          </div>
        </div>
        <div className={`mt-4 text-center text-xs sm:text-sm ${theme.footer}`}>
          &copy; {new Date().getUTCFullYear()} Sticky. {theme.copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;