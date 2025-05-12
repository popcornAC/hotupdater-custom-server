import { OTABundle } from '../types';

export interface IOTABundlesProvider {
    getBundleById(id: string): Promise<OTABundle | null>;
    getRelevantBundles(
        platform: "ios" | "android",
        channel: string,
        appVersion: string
    ): Promise<OTABundle[]>;
} 