import { Link } from 'react-router-dom';
import Logo from "../logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useHalloween } from '../../providers/halloween-provider';
import { useChristmas } from '../../providers/christmas-provider';
import { useSpring } from '../../providers/spring-provider';
import { HalloweenSwitcher } from '../halloween-switcher';
import { ChristmasSwitcher } from '../christmas-switcher';
import { SpringSwitcher } from '../spring-switcher';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useLanguage } from '../../providers/language-provider';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isHalloweenMode } = useHalloween();
    const { isChristmasMode } = useChristmas();
    const { isSpringMode } = useSpring();
    const { t } = useLanguage();

    const getThemeClasses = () => {
        if (isHalloweenMode) {
            return {
                nav: 'border-halloween-orange/50 bg-halloween-black/90 text-halloween-ghost',
                logo: 'animate-spooky-shake',
                text: 'text-halloween-orange',
                icon: 'text-halloween-orange',
                button: 'bg-halloween-orange hover:bg-halloween-purple text-white',
                menu: 'bg-halloween-black/90 border-halloween-orange/50 text-halloween-ghost',
                signIn: t('nav.signIn.halloween')
            };
        }
        if (isChristmasMode) {
            return {
                nav: 'border-christmas-red/50 bg-christmas-black/90 text-christmas-snow',
                logo: 'animate-sparkle',
                text: 'text-christmas-red',
                icon: 'text-christmas-red',
                button: 'bg-christmas-red hover:bg-christmas-gold text-white',
                menu: 'bg-christmas-black/90 border-christmas-red/50 text-christmas-snow',
                signIn: t('nav.signIn.christmas')
            };
        }
        if (isSpringMode) {
            return {
                nav: 'border-spring-pink/50 bg-spring-black/90 text-spring-petal',
                logo: 'animate-bloom',
                text: 'text-spring-pink',
                icon: 'text-spring-pink',
                button: 'bg-spring-pink hover:bg-spring-green text-white',
                menu: 'bg-spring-black/90 border-spring-pink/50 text-spring-petal',
                signIn: t('nav.signIn.spring')
            };
        }
        return {
            nav: 'border-border bg-white text-text dark:border-darkBorder dark:bg-secondaryBlack dark:text-text-dark dark:shadow-dark',
            logo: '',
            text: '',
            icon: '',
            button: 'bg-white',
            menu: 'bg-white dark:bg-secondaryBlack border-border dark:border-darkBorder',
            signIn: t('nav.signIn')
        };
    };

    const theme = getThemeClasses();

    return (
        <nav className="fixed left-0 top-0 z-50 w-full px-4 pt-4">
            <div className={`z-50 mx-auto flex h-14 w-full max-w-[1024px] items-center justify-between rounded-base border px-4 shadow-light ${theme.nav}`}>
                <Link to="/" className="flex items-center">
                    <Logo className={`h-8 w-8 mr-2 ${theme.logo}`} />
                    <span className={`text-lg font-heading sm:text-base ${theme.text}`}>
                        Sticky
                    </span>
                </Link>

                <div className="hidden sm:flex items-center space-x-8 text-sm flex-grow justify-center">
                </div>

                <div className="hidden sm:flex items-center space-x-4">
                    <LanguageSwitcher />
                    <HalloweenSwitcher />
                    <ChristmasSwitcher />
                    <SpringSwitcher />
                    <Link to="/signin">
                        <Button className={theme.button} onClick={() => { }}>
                            {theme.signIn}
                        </Button>
                    </Link>
                </div>

                <button
                    className="sm:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen
                        ? <X className={`h-6 w-6 ${theme.icon}`} />
                        : <Menu className={`h-6 w-6 ${theme.icon}`} />
                    }
                </button>
            </div>

            {isMenuOpen && (
                <div className={`sm:hidden relative top-full left-0 w-full mt-2 rounded-base border ${theme.menu}`}>
                    <div className="flex flex-col items-center py-4 space-y-4">
                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <HalloweenSwitcher />
                            <ChristmasSwitcher />
                            <SpringSwitcher />
                            <Link to="/signin">
                                <Button className={theme.button} onClick={() => { }}>
                                    {theme.signIn}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;