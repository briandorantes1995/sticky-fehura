import React from 'react';
import { Button } from '../ui/button';
import { Check, Skull } from 'lucide-react';
import Preview from './preview';
import { useHalloween } from '../../providers/halloween-provider';
import { useChristmas } from '../../providers/christmas-provider';
import { useSpring } from '../../providers/spring-provider';
import { useLanguage } from '../../providers/language-provider';

const HeroSection: React.FC = () => {
    const { isHalloweenMode } = useHalloween();
    const { isChristmasMode } = useChristmas();
    const { isSpringMode } = useSpring();
    const { t } = useLanguage();

    const getThemeData = () => {
        if (isHalloweenMode) {
            return {
                features: [t('hero.feature1.halloween'), t('hero.feature2.halloween'), t('hero.feature3.halloween')],
                bg: 'bg-gradient-to-b from-halloween-black to-halloween-purple/30',
                title: t('hero.title.halloween'),
                subtitle: t('hero.subtitle.halloween'),
                description: t('hero.description.halloween'),
                button: t('hero.button.halloween'),
                titleClass: 'text-halloween-orange animate-spooky-shake',
                subtitleClass: 'text-halloween-orange',
                descriptionClass: 'text-halloween-ghost animate-float',
                featureClass: 'text-halloween-ghost',
                buttonClass: 'bg-halloween-orange hover:bg-halloween-purple text-white',
                icon: Skull,
                iconClass: 'text-halloween-orange'
            };
        }
        if (isChristmasMode) {
            return {
                features: [t('hero.feature1.christmas'), t('hero.feature2.christmas'), t('hero.feature3.christmas')],
                bg: 'bg-gradient-to-b from-christmas-black to-christmas-red/30',
                title: t('hero.title.christmas'),
                subtitle: t('hero.subtitle.christmas'),
                description: t('hero.description.christmas'),
                button: t('hero.button.christmas'),
                titleClass: 'text-christmas-red animate-sparkle',
                subtitleClass: 'text-christmas-red',
                descriptionClass: 'text-christmas-snow animate-float',
                featureClass: 'text-christmas-snow',
                buttonClass: 'bg-christmas-red hover:bg-christmas-gold text-white',
                icon: Check,
                iconClass: 'text-christmas-red'
            };
        }
        if (isSpringMode) {
            return {
                features: [t('hero.feature1.spring'), t('hero.feature2.spring'), t('hero.feature3.spring')],
                bg: 'bg-gradient-to-b from-spring-black to-spring-pink/30',
                title: t('hero.title.spring'),
                subtitle: t('hero.subtitle.spring'),
                description: t('hero.description.spring'),
                button: t('hero.button.spring'),
                titleClass: 'text-spring-pink animate-bloom',
                subtitleClass: 'text-spring-pink',
                descriptionClass: 'text-spring-petal animate-float',
                featureClass: 'text-spring-petal',
                buttonClass: 'bg-spring-pink hover:bg-spring-green text-white',
                icon: Check,
                iconClass: 'text-spring-pink'
            };
        }
        return {
            features: [t('hero.feature1'), t('hero.feature2'), t('hero.feature3')],
            bg: '',
            title: t('hero.title'),
            subtitle: t('hero.subtitle'),
            description: t('hero.description'),
            button: t('hero.button'),
            titleClass: 'text-text dark:text-text-dark',
            subtitleClass: '',
            descriptionClass: 'text-text dark:text-text-dark',
            featureClass: '',
            buttonClass: '',
            icon: Check,
            iconClass: 'text-main'
        };
    };

    const theme = getThemeData();
    const IconComponent = theme.icon;

    return (
        <>
            <section className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden ${theme.bg}`}>
                <div className="text-center w-full max-w-5xl mx-auto">
                    <h1 className={`mb-6 sm:mb-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight ${theme.titleClass}`}>
                        {theme.title}
                        <span className="relative inline-block ml-2">
                            <span className={`text-base-secondary absolute -bottom-2 left-1/2 flex -translate-x-1/2 translate-y-full -rotate-3 
                                flex-nowrap items-center gap-1 whitespace-nowrap text-base sm:text-lg md:text-xl lg:text-2xl font-normal tracking-wide ${theme.subtitleClass}`}>
                                {theme.subtitle}
                            </span>
                        </span>
                    </h1>
                    <p className={`mb-8 sm:mb-10 text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed max-w-2xl mx-auto ${theme.descriptionClass}`}>
                        {theme.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-12 sm:mb-16">
                        {theme.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-center gap-2">
                                <IconComponent className={`h-6 w-6 sm:h-7 sm:w-7 ${theme.iconClass} flex-shrink-0`} strokeWidth={3} />
                                <span className={`text-lg sm:text-xl font-medium ${theme.featureClass}`}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Button 
                            onClick={() => window.location.href = '/signin'} 
                            className={`text-xl sm:text-2xl px-8 sm:px-10 py-4 sm:py-5 ${theme.buttonClass}`}
                        >
                            {theme.button}
                        </Button>
                    </div>
                </div>
            </section>
            <Preview />
        </>
    );
};

export default HeroSection;