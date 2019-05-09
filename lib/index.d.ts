import React from 'react';
import { InlineSVGError } from './utils';
export interface Props {
    baseURL?: string;
    cacheRequests?: boolean;
    children?: React.ReactNode;
    description?: string;
    loader?: React.ReactNode;
    onError?: (error: InlineSVGError | FetchError) => void;
    onLoad?: (src: URL | string, isCached: boolean) => void;
    preProcessor?: (code: string) => string;
    src: string;
    title?: string;
    uniqueHash?: string;
    uniquifyIDs?: boolean;
    [key: string]: any;
}
export interface State {
    content: string;
    element: React.ReactNode;
    hasCache: boolean;
    status: string;
}
export interface FetchError extends Error {
    message: string;
    type: string;
    errno: string;
    code: string;
}
export interface StorageItem {
    url: string;
    content: string;
    queue: any[];
    loading: boolean;
}
export declare const STATUS: {
    FAILED: string;
    LOADED: string;
    LOADING: string;
    PENDING: string;
    READY: string;
    UNSUPPORTED: string;
};
export declare const storage: StorageItem[];
export default class InlineSVG extends React.PureComponent<Props, State> {
    private static defaultProps;
    private _isMounted;
    constructor(props: Props);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props, prevState: State): void;
    componentWillUnmount(): void;
    isMounted: boolean;
    private parseSVG;
    private updateSVGAttributes;
    private generateNode;
    private generateElement;
    private load;
    private handleLoad;
    private handleError;
    private request;
    render(): {} | null;
}
