import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Hero Section
    'hero.title': 'Ideas that stick',
    'hero.title.halloween': 'Spooky ideas that stick',
    'hero.subtitle': 'literally 😉',
    'hero.subtitle.halloween': 'if you dare 👻',
    'hero.description': 'Connect your thoughts in one sticky playground.',
    'hero.description.halloween': 'Where your thoughts come alive... muhahaha!',
    'hero.feature1': 'Capture ideas',
    'hero.feature1.halloween': 'Haunt your ideas',
    'hero.feature2': 'Organize effortlessly',
    'hero.feature2.halloween': 'Spooky organization',
    'hero.feature3': 'Collaborate in real-time',
    'hero.feature3.halloween': 'Ghostly collaboration',
    'hero.button': 'Try now!',
    'hero.button.halloween': 'Enter if you dare!',
    
    // Preview Section
    'preview.title': 'The duct tape for your brain',
    'preview.title.halloween': 'The haunted tape for your brain',
    'preview.description': 'Who needs a photographic memory?',
    'preview.description.halloween': 'Who needs a memory when you have ghostly notes?',
    'preview.button': 'Stick It to Chaos!',
    'preview.button.halloween': 'Summon Your Notes!',
    
    // Nav
    'nav.signIn': 'Sign In',
    'nav.signIn.halloween': 'Enter Portal',
    
    // Sign In
    'signin.title': 'Sign In',
    'signin.email': 'Email',
    'signin.password': 'Password',
    'signin.submit': 'Sign In',
    'signin.submitting': 'Signing in...',
    'signin.error': 'Error signing in',
    'signin.or': 'Or continue with',
    
    // Boards
    'boards.title': 'Your Boards',
    'boards.new': 'New Board',
    'boards.new.halloween': 'Summon Board',
    'boards.search': 'Search boards...',
    'boards.search.halloween': 'Search your haunted boards...',
    'boards.sort': 'Sort',
    'boards.recent': 'Recent',
    'boards.oldest': 'Oldest',
    'boards.alphabetical': 'Alphabetical',
    'boards.mostNotes': 'Most Notes',
    'boards.organize': 'Organize',
    'boards.all': 'All Boards',
    'boards.trash': 'Trash',
    'boards.trashed': 'Trashed Boards',
    'boards.open': 'Open',
    'boards.lastModified': 'Last modified',
    'boards.notes': 'notes',
    'boards.note': 'note',
    'boards.empty': "You don't have any boards yet. Create one to get started!",
    'boards.empty.trash': "Your trash is empty. Deleted boards will appear here.",
    'boards.loadMore': 'Load More',
    
    // Feedback
    'feedback.title': 'We Value Your Feedback!',
    'feedback.description': 'Your thoughts help us improve. Share your experience or suggestions below:',
    'feedback.placeholder': 'Type your feedback here...',
    'feedback.submit': 'Submit Feedback',
    'feedback.error': 'Please enter your feedback before submitting.',
    'feedback.success': 'Thank you for your feedback! We appreciate your input.',
    'feedback.error.submit': 'Failed to submit feedback. Please try again.',
    'feedback.error.login': 'You must be logged in to submit feedback.',
    
    // OAuth
    'oauth.google': 'Continue with Google',
    'oauth.azure': 'Continue with Azure',
    'oauth.loading': 'Loading...',
    'oauth.processing': 'Processing login...',
    'oauth.backToSignIn': 'Back to Sign In',
    'oauth.error.noToken': 'No access token found',
    'oauth.error.userNotFound': 'User not found. Please complete your registration first.',
    'oauth.error.incompleteProfile': 'Your profile is incomplete. Please complete your profile first.',
    'oauth.error.exchangeFailed': 'Failed to exchange token. Please try again.',
    'oauth.error.loginFailed': 'Failed to start OAuth login. Please try again.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.shareCodeError': "Invalid share code. The board you're trying to access doesn't exist or has been deleted.",
  },
  es: {
    // Hero Section
    'hero.title': 'Ideas que se quedan',
    'hero.title.halloween': 'Ideas espeluznantes que se quedan',
    'hero.subtitle': 'literalmente 😉',
    'hero.subtitle.halloween': 'si te atreves 👻',
    'hero.description': 'Conecta tus pensamientos en un espacio pegajoso.',
    'hero.description.halloween': '¡Donde tus pensamientos cobran vida... muhahaha!',
    'hero.feature1': 'Captura ideas',
    'hero.feature1.halloween': 'Acecha tus ideas',
    'hero.feature2': 'Organiza sin esfuerzo',
    'hero.feature2.halloween': 'Organización espeluznante',
    'hero.feature3': 'Colabora en tiempo real',
    'hero.feature3.halloween': 'Colaboración fantasmal',
    'hero.button': '¡Pruébalo ahora!',
    'hero.button.halloween': '¡Entra si te atreves!',
    
    // Preview Section
    'preview.title': 'La cinta adhesiva para tu cerebro',
    'preview.title.halloween': 'La cinta embrujada para tu cerebro',
    'preview.description': '¿Quién necesita memoria fotográfica?',
    'preview.description.halloween': '¿Quién necesita memoria cuando tienes notas fantasmas?',
    'preview.button': '¡Pégalo al Caos!',
    'preview.button.halloween': '¡Invoca Tus Notas!',
    
    // Nav
    'nav.signIn': 'Iniciar Sesión',
    'nav.signIn.halloween': 'Entrar al Portal',
    
    // Sign In
    'signin.title': 'Iniciar Sesión',
    'signin.email': 'Correo electrónico',
    'signin.password': 'Contraseña',
    'signin.submit': 'Iniciar Sesión',
    'signin.submitting': 'Iniciando sesión...',
    'signin.error': 'Error al iniciar sesión',
    'signin.or': 'O continúa con',
    
    // Boards
    'boards.title': 'Tus Tableros',
    'boards.new': 'Nuevo Tablero',
    'boards.new.halloween': 'Invocar Tablero',
    'boards.search': 'Buscar tableros...',
    'boards.search.halloween': 'Busca tus tableros embrujados...',
    'boards.sort': 'Ordenar',
    'boards.recent': 'Recientes',
    'boards.oldest': 'Más antiguos',
    'boards.alphabetical': 'Alfabético',
    'boards.mostNotes': 'Más Notas',
    'boards.organize': 'Organizar',
    'boards.all': 'Todos los Tableros',
    'boards.trash': 'Papelera',
    'boards.trashed': 'Tableros Eliminados',
    'boards.open': 'Abrir',
    'boards.lastModified': 'Última modificación',
    'boards.notes': 'notas',
    'boards.note': 'nota',
    'boards.empty': '¡Aún no tienes tableros! Crea uno para comenzar.',
    'boards.empty.trash': 'Tu papelera está vacía. Los tableros eliminados aparecerán aquí.',
    'boards.loadMore': 'Cargar Más',
    
    // Feedback
    'feedback.title': '¡Valoramos Tu Opinión!',
    'feedback.description': 'Tus pensamientos nos ayudan a mejorar. Comparte tu experiencia o sugerencias a continuación:',
    'feedback.placeholder': 'Escribe tu opinión aquí...',
    'feedback.submit': 'Enviar Opinión',
    'feedback.error': 'Por favor ingresa tu opinión antes de enviar.',
    'feedback.success': '¡Gracias por tu opinión! La apreciamos.',
    'feedback.error.submit': 'Error al enviar la opinión. Por favor intenta de nuevo.',
    'feedback.error.login': 'Debes iniciar sesión para enviar tu opinión.',
    
    // OAuth
    'oauth.google': 'Continuar con Google',
    'oauth.azure': 'Continuar con Azure',
    'oauth.loading': 'Cargando...',
    'oauth.processing': 'Procesando login...',
    'oauth.backToSignIn': 'Volver a Iniciar Sesión',
    'oauth.error.noToken': 'No se encontró el token de acceso',
    'oauth.error.userNotFound': 'Usuario no encontrado. Por favor, completa tu registro primero.',
    'oauth.error.incompleteProfile': 'Tu perfil está incompleto. Por favor, completa tu perfil primero.',
    'oauth.error.exchangeFailed': 'Error al intercambiar token. Por favor, intenta de nuevo.',
    'oauth.error.loginFailed': 'Error al iniciar login OAuth. Por favor, intenta de nuevo.',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.shareCodeError': 'Código de compartir inválido. El tablero al que intentas acceder no existe o ha sido eliminado.',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Cargar idioma desde localStorage o usar español por defecto
    const saved = localStorage.getItem('language') as Language;
    return saved || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

