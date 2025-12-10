import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserButton } from '../components/UserButton';
import Logo from '../components/logo';
import { Button } from '../components/ui/button';
import Footer from '../components/lander/footer';
import { Search, Plus, Trash2, Folder, RefreshCw, Ghost, Skull } from 'lucide-react';
import Dropdown from '../components/ui/dropdown';
import { usePaginatedQuery, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { formatLastModified } from '../libs/utils';
import EmptyState from '../components/EmptyState';
import { useHalloween } from '../providers/halloween-provider';
import { LoadingIndicator } from './LoadingIndicator';
import { HalloweenSwitcher } from '../components/halloween-switcher';
import { useConvexAuth } from '../hooks/useConvexAuth';
import { useLanguage } from '../providers/language-provider';

const BoardsList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'Recent' | 'Oldest' | 'Alphabetical' | 'Most Notes'>('Recent');
    const [showTrashed, setShowTrashed] = useState(false);
    const { isHalloweenMode } = useHalloween();
    const { user, token } = useConvexAuth();
    const { t } = useLanguage();

    const { results, status, loadMore } = usePaginatedQuery(
        api.boards.getLazyBoards,
        token ? { token, searchTerm, sortBy, showTrashed } : "skip",
        { initialNumItems: 10 }
    );

    const createBoard = useMutation(api.boards.createBoard);
    const deleteBoard = useMutation(api.boards.deleteBoard);
    const updateBoard = useMutation(api.boards.updateBoard);
    const restoreBoard = useMutation(api.boards.restoreBoard);
    const permanentlyDeleteBoard = useMutation(api.boards.permanentlyDeleteBoard);
    const userBoardsCount = useQuery(api.boards.getUserBoardsCount, token ? { token } : "skip") || 0;
    const userBoardsTrashCount = useQuery(api.boards.getUserBoardsTrashCount, token ? { token } : "skip") || 0;
    const [newBoardId, setNewBoardId] = useState<Id<"boards"> | null>(null);


    const handleCreateBoard = useCallback(async () => {
        if (!token) return;
        const newBoardName = t('boards.new');
        const newBoardId = await createBoard({ token, name: newBoardName });
        return newBoardId;
    }, [createBoard, token, t]);

    const handleDeleteBoard = useCallback(async (boardId: Id<"boards">) => {
        await deleteBoard({ boardId });
    }, [deleteBoard]);

    const handleEditBoard = useCallback(async (boardId: Id<"boards">, newName: string) => {
        if (newName.trim() === '') return;
        await updateBoard({ boardId, name: newName });
    }, [updateBoard]);

    const handleRestoreBoard = useCallback(async (boardId: Id<"boards">) => {
        await restoreBoard({ boardId });
    }, [restoreBoard]);

    const handlePermanentlyDeleteBoard = useCallback(async (boardId: Id<"boards">) => {
        await permanentlyDeleteBoard({ boardId });
    }, [permanentlyDeleteBoard]);

    const handleSortChange = useCallback((option: string) => {
        // Mapear las traducciones de vuelta a los valores originales
        const sortMap: Record<string, 'Recent' | 'Oldest' | 'Alphabetical' | 'Most Notes'> = {
            [t('boards.recent')]: 'Recent',
            [t('boards.oldest')]: 'Oldest',
            [t('boards.alphabetical')]: 'Alphabetical',
            [t('boards.mostNotes')]: 'Most Notes',
        };
        setSortBy(sortMap[option] || 'Recent');
    }, [t]);

    const sortOptions = [
        { name: t('boards.recent'), link: '#' },
        { name: t('boards.oldest'), link: '#' },
        { name: t('boards.alphabetical'), link: '#' },
        { name: t('boards.mostNotes'), link: '#' },
    ];

    return (
        <div className={`min-h-screen flex flex-col ${isHalloweenMode
                ? 'bg-gradient-to-b from-halloween-black via-halloween-purple/30 to-halloween-black'
                : 'bg-white dark:bg-darkBg'
            }`}>
            <header className={`shadow-sm sticky top-0 z-10 ${isHalloweenMode
                    ? 'bg-halloween-black border-b border-halloween-orange'
                    : 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 sm:mb-0">
                            <Logo className={`h-8 w-8 mr-2 ${isHalloweenMode ? 'animate-spooky-shake' : ''}`} />
                            <div className="flex flex-col">
                                <span className={`text-lg font-bold ${isHalloweenMode ? 'text-halloween-orange' : 'text-gray-600 dark:text-gray-300'
                                    }`}>
                                    Sticky
                                </span>
                                {user?.company?.name && (
                                    <span className={`text-xs ${isHalloweenMode ? 'text-halloween-ghost' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {user.company.name}
                                    </span>
                                )}
                            </div>
                            <span className={`ml-2 inline-flex items-center rounded text-xs font-medium ${isHalloweenMode ? 'text-halloween-ghost' : ''
                                }`}>
                                {isHalloweenMode ? 'Haunted Beta' : 'Beta'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                onClick={async () => {
                                    const boardId = await handleCreateBoard();
                                    if (boardId) {
                                        setNewBoardId(boardId);
                                    }
                                }}
                                size="sm"
                                className={`flex items-center ${isHalloweenMode
                                        ? 'bg-halloween-orange hover:bg-halloween-purple text-white'
                                        : ''
                                    }`}
                            >
                                {isHalloweenMode ? <Ghost className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                <span className="inline">
                                    {isHalloweenMode ? t('boards.new.halloween') : t('boards.new')}
                                </span>
                            </Button>
                            <UserButton />
                            <HalloweenSwitcher/>
                        </div>
                    </div>
                </div>
            </header>

            {isHalloweenMode && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-10 animate-float delay-1000">
                        <Ghost className="w-8 h-8 text-halloween-ghost opacity-30" />
                    </div>
                    <div className="absolute top-1/2 right-10 animate-float delay-2000">
                        <Skull className="w-8 h-8 text-halloween-ghost opacity-30" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-halloween-ghost to-transparent opacity-10 animate-fog-roll" />
                </div>
            )}

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('boards.title')}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
                        <div className="relative mb-4 sm:mb-0">
                            <input
                                type="text"
                                placeholder={isHalloweenMode ? t('boards.search.halloween') : t('boards.search')}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isHalloweenMode
                                        ? 'bg-halloween-black/50 border-halloween-orange text-halloween-ghost placeholder-halloween-ghost/50'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500'
                                    }`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <Dropdown
                            items={sortOptions}
                            text={`${t('boards.sort')}: ${sortBy}`}
                            onSelect={handleSortChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-8">
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('boards.organize')}</h2>
                        <ul className="space-y-2">
                            <li>
                                <Button
                                    onClick={() => setShowTrashed(false)}
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center">
                                        <Folder className="w-4 h-4 mr-2" />
                                        {t('boards.all')}
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full">
                                        {userBoardsCount}
                                    </span>
                                </Button>
                            </li>
                            <li>
                                <Button onClick={() => setShowTrashed(true)} className="w-full flex items-ceneter justify-between bg-red-500 hover:bg-red-600">
                                    <div className="flex items-center">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {t('boards.trash')}
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full">
                                        {userBoardsTrashCount}
                                    </span>
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className="w-full md:w-3/4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {showTrashed ? t('boards.trashed') : (() => {
                                const sortMap: Record<string, string> = {
                                    'Recent': t('boards.recent'),
                                    'Oldest': t('boards.oldest'),
                                    'Alphabetical': t('boards.alphabetical'),
                                    'Most Notes': t('boards.mostNotes'),
                                };
                                return `${sortMap[sortBy] || sortBy} ${t('boards.title')}`;
                            })()}
                        </h2>
                        <div className="h-[calc(100vh-300px)] overflow-y-auto">
                            {status === "LoadingFirstPage" || status === "LoadingMore" ? (
                                <LoadingIndicator />
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                                    {results?.map((board) => (
                                        <div key={board._id}
                                            className={`block ${isHalloweenMode
                                                    ? 'bg-halloween-black/50 border-2 border-halloween-orange/50 hover:border-halloween-orange'
                                                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                                                } rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                                        >
                                            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                                                <div className="p-6">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                        <input
                                                            type="text"
                                                            defaultValue={board.name}
                                                            className="w-full bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md focus:p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:p-2"
                                                            onBlur={(e) => handleEditBoard(board._id, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                        />
                                                    </h3>
                                                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-xs">
                                                        {t('boards.lastModified')}: {formatLastModified(board.lastModified)}
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {board.notesCount === 1 ? `1 ${t('boards.note')}` : `${board.notesCount || 0} ${t('boards.notes')}`}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            {showTrashed ? (
                                                                <>
                                                                    <Button size="sm" onClick={() => handleRestoreBoard(board._id)}>
                                                                        <RefreshCw className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="sm" onClick={() => handlePermanentlyDeleteBoard(board._id)} className="bg-red-500 hover:bg-red-600">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link to={`/board/${board._id}`}>
                                                                        <Button
                                                                            size="sm"
                                                                            className={`flex items-center ${board._id === newBoardId ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                                                                            onClick={() => setNewBoardId(null)}
                                                                        >
                                                                            <Folder className="w-4 h-4 mr-1" />
                                                                            {t('boards.open')}
                                                                        </Button>
                                                                    </Link>
                                                                    <Button size="sm" onClick={() => handleDeleteBoard(board._id)}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    message={showTrashed ? t('boards.empty.trash') : t('boards.empty')}
                                    buttonText={showTrashed ? undefined : t('boards.new')}
                                    onButtonClick={showTrashed ? undefined : handleCreateBoard}
                                />
                            )}
                        </div>
                        {status === "CanLoadMore" && (
                            <div className="mt-4 text-center">
                                <Button onClick={() => loadMore(10)}>{t('boards.loadMore')}</Button>
                            </div>
                        )}
                        {status === "LoadingMore" && <LoadingIndicator />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BoardsList;