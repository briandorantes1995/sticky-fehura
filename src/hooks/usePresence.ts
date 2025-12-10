import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useCallback, useRef, useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import debounce from 'lodash.debounce';
import { useApiAuth } from "./useApiAuth";

const PRESENCE_UPDATE_INTERVAL = 100;
const HEARTBEAT_INTERVAL = 30000;

export function usePresence(boardId: Id<"boards">, isShared: boolean) {
  const { token } = useApiAuth();
  const updatePresence = useMutation(api.presence.updatePresence);
  const removePresence = useMutation(api.presence.removePresence);
  const activeUsers = useQuery(api.presence.getActiveUsers, token ? { token, boardId } : "skip");
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const [localCursorPosition, setLocalCursorPosition] = useState({ x: 0, y: 0 });

  const debouncedUpdatePresence = useCallback(
    debounce((position: { x: number; y: number }) => {
      if (isShared && token) {
        updatePresence({
          token,
          boardId,
          cursorPosition: position,
          isHeartbeat: false
        });
      }
    }, PRESENCE_UPDATE_INTERVAL, { maxWait: PRESENCE_UPDATE_INTERVAL * 2 }),
    [boardId, updatePresence, isShared, token]
  );

  const updateCursorPosition = useCallback((position: { x: number; y: number }) => {
    cursorPositionRef.current = position;
    setLocalCursorPosition(position);
    if (isShared) {
      debouncedUpdatePresence(position);
    }
  }, [debouncedUpdatePresence, isShared]);

  useEffect(() => {
    if (!isShared || !token) return;

    const heartbeatInterval = setInterval(() => {
      updatePresence({
        token,
        boardId,
        cursorPosition: cursorPositionRef.current,
        isHeartbeat: true
      });
    }, HEARTBEAT_INTERVAL);
  
    return () => {
      clearInterval(heartbeatInterval);
      if (token) {
        removePresence({ token, boardId });
      }
    };
  }, [boardId, updatePresence, removePresence, isShared, token]);

  return {
    activeUsers: isShared ? activeUsers : [],
    updateCursorPosition,
    localCursorPosition
  };
}