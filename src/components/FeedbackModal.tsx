import React, { useState, useCallback } from 'react';
import Modal from './ui/modal';
import { Button } from './ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useToast } from '../hooks/use-toast';
import { useApiAuth } from '../hooks/useApiAuth';
import { useLanguage } from '../providers/language-provider';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const { token } = useApiAuth();
    const { t } = useLanguage();
    const submitHelpRequest = useMutation(api.support.supportRequest);
    const { toast } = useToast();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        setError('');
    }, []);

    const handleSubmit = async () => {
        if (!input.trim()) {
            setError(t('feedback.error'));
            return;
        }

        if (!token) {
            toast({
                title: t('common.error'),
                description: t('feedback.error.login'),
                variant: "destructive",
            });
            return;
        }

        try {
            await submitHelpRequest({ token, input });
            toast({
                title: t('feedback.success'),
                description: t('feedback.success'),
            });
            setInput('');
            onClose();
        } catch (error) {
            toast({
                title: t('common.error'),
                description: t('feedback.error.submit'),
                variant: "destructive",
            });
        }
    };

    return (
        <Modal active={isOpen} setActive={onClose}>
            <h2 className="text-2xl font-bold mb-4 text-text dark:text-text-dark">{t('feedback.title')}</h2>
            <p className="mb-4 text-text dark:text-text-dark">{t('feedback.description')}</p>
            <textarea
                className={`w-full mb-2 p-2 rounded-base border-2 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack text-text dark:text-text-dark ${error ? 'border-red-500' : ''}`}
                value={input}
                onChange={handleInputChange}
                placeholder={t('feedback.placeholder')}
                rows={4}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end">
                <Button 
                    onClick={handleSubmit} 
                    className={`bg-main hover:bg-mainAccent ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {t('feedback.submit')}
                </Button>
            </div>
        </Modal>
    );
};

export default FeedbackModal;