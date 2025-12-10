import React from 'react';
import { Button } from '../ui/button';
import { useHalloween } from '../../providers/halloween-provider';
import { useChristmas } from '../../providers/christmas-provider';
import { useSpring } from '../../providers/spring-provider';
import { useLanguage } from '../../providers/language-provider';

const Preview: React.FC = () => {
    const { isHalloweenMode } = useHalloween();
    const { isChristmasMode } = useChristmas();
    const { isSpringMode } = useSpring();
    const { t } = useLanguage();

    const getThemeData = () => {
        if (isHalloweenMode) {
            return {
                bg: 'bg-halloween-black/90 animate-flicker',
                title: t('preview.title.halloween'),
                description: t('preview.description.halloween'),
                button: t('preview.button.halloween'),
                titleClass: 'text-halloween-orange',
                descriptionClass: 'text-halloween-ghost',
                buttonClass: 'bg-halloween-orange hover:bg-halloween-purple text-white',
                logoClass: 'animate-spooky-shake',
                gradient: 'bg-gradient-to-tr from-halloween-purple/20 to-halloween-orange/20',
                imageFilter: 'filter hue-rotate-180 contrast-125'
            };
        }
        if (isChristmasMode) {
            return {
                bg: 'bg-christmas-black/90',
                title: t('preview.title.christmas'),
                description: t('preview.description.christmas'),
                button: t('preview.button.christmas'),
                titleClass: 'text-christmas-red',
                descriptionClass: 'text-christmas-snow',
                buttonClass: 'bg-christmas-red hover:bg-christmas-gold text-white',
                logoClass: 'animate-sparkle',
                gradient: 'bg-gradient-to-tr from-christmas-red/20 to-christmas-gold/20',
                imageFilter: 'filter brightness-110'
            };
        }
        if (isSpringMode) {
            return {
                bg: 'bg-spring-black/90',
                title: t('preview.title.spring'),
                description: t('preview.description.spring'),
                button: t('preview.button.spring'),
                titleClass: 'text-spring-pink',
                descriptionClass: 'text-spring-petal',
                buttonClass: 'bg-spring-pink hover:bg-spring-green text-white',
                logoClass: 'animate-bloom',
                gradient: 'bg-gradient-to-tr from-spring-pink/20 to-spring-green/20',
                imageFilter: 'filter brightness-110 saturate-110'
            };
        }
        return {
            bg: 'bg-white dark:bg-darkBg opacity-90',
            title: t('preview.title'),
            description: t('preview.description'),
            button: t('preview.button'),
            titleClass: 'text-text dark:text-text-dark',
            descriptionClass: 'text-text dark:text-text-dark',
            buttonClass: '',
            logoClass: '',
            gradient: 'bg-gradient-to-tr from-main/20 to-base-secondary/20',
            imageFilter: 'filter grayscale group-hover:grayscale-0'
        };
    };

    const theme = getThemeData();

    return (
        <section className="px-4 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32">
            <div className="relative w-full min-h-[60vh] overflow-hidden rounded-3xl">
                <div className={`absolute inset-0 ${theme.bg}`}></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between">
                    <div className="w-full lg:w-1/2 mb-8 lg:mb-0 pr-0 lg:pr-8">
                        <h2 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 ${theme.titleClass}`}>
                            {theme.title}
                            <img
                                src={"/duct-tape.png"}
                                alt="Tape for your brain"
                                className={`w-16 h-16 mr-4 ${theme.logoClass}`}
                            />
                        </h2>
                        <p className={`text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-80 ${theme.descriptionClass}`}>
                            {theme.description}
                        </p>
                        <Button
                            onClick={() => window.location.href = '/signin'}
                            className={`text-base sm:text-lg lg:text-xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 ${theme.buttonClass}`}
                        >
                            {theme.button}
                        </Button>
                    </div>
                    <div className={`relative w-full aspect-square rounded-2xl shadow-2xl overflow-hidden group ${theme.gradient}`}>
                        <img
                            src="/board.png"
                            alt="Sticky app preview"
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${theme.imageFilter}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Preview;