import * as react from 'react';

interface PlayerProps {
    projectId?: string;
    directUrl?: string;
    onLoad: () => void;
    /** Fires once the loaded document is painted and every loader (shader, assets) has cleared. */
    onReadyToShowChange?: (ready: boolean) => void;
    onPreviewError?: (message: string) => void;
    onCompositionLoadingChange?: (loading: boolean) => void;
    onPainted?: (details: {
        iframe: HTMLIFrameElement;
        startedAt: number;
        loadId: number;
    }) => void;
    portrait?: boolean;
    style?: React.CSSProperties;
    suppressLoadingOverlay?: boolean;
}
/**
 * Renders a composition preview using the <hyperframes-player> web component.
 *
 * The web component handles iframe scaling, dimension detection, and
 * ResizeObserver internally. This wrapper bridges its inner iframe to the
 * forwarded ref so useTimelinePlayer can access it for clip manifest parsing,
 * timeline probing, and DOM inspection.
 */
declare const Player: react.ForwardRefExoticComponent<PlayerProps & react.RefAttributes<HTMLIFrameElement>>;

export { Player };
