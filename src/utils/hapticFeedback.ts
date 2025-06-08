// Haptic feedback utilities for mobile interactions

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

interface HapticOptions {
    type?: HapticFeedbackType;
    duration?: number;
    intensity?: number;
}

class HapticFeedback {
    private static instance: HapticFeedback;
    private isSupported: boolean = false;
    private vibrationAPI: boolean = false;

    constructor() {
        this.checkSupport();
    }

    static getInstance(): HapticFeedback {
        if (!HapticFeedback.instance) {
            HapticFeedback.instance = new HapticFeedback();
        }
        return HapticFeedback.instance;
    }

    private checkSupport() {
        // Check for Vibration API
        this.vibrationAPI = 'vibrate' in navigator;

        // Check for iOS Haptic Feedback (iOS 10+)
        // Note: This is not directly detectable, but we can infer from user agent
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        this.isSupported = this.vibrationAPI || isIOS;
    }

    // Main haptic feedback method
    public feedback(type: HapticFeedbackType = 'light', options: HapticOptions = {}) {
        if (!this.isSupported) return;

        try {
            // For iOS devices with haptic feedback support
            if ('Haptics' in window && typeof (window as any).Haptics.notification === 'function') {
                this.iosHapticFeedback(type);
                return;
            }

            // Fallback to vibration API
            if (this.vibrationAPI) {
                this.vibrationFeedback(type, options);
            }
        } catch (error) {
            console.debug('Haptic feedback not available:', error);
        }
    }

    private iosHapticFeedback(type: HapticFeedbackType) {
        const haptics = (window as any).Haptics;

        switch (type) {
            case 'light':
                haptics.impact?.({ style: 'light' });
                break;
            case 'medium':
                haptics.impact?.({ style: 'medium' });
                break;
            case 'heavy':
                haptics.impact?.({ style: 'heavy' });
                break;
            case 'selection':
                haptics.selection?.();
                break;
            case 'notification':
                haptics.notification?.({ type: 'success' });
                break;
            default:
                haptics.impact?.({ style: 'light' });
        }
    }

    private vibrationFeedback(type: HapticFeedbackType, options: HapticOptions) {
        let pattern: number | number[] = 10;

        switch (type) {
            case 'light':
                pattern = 10;
                break;
            case 'medium':
                pattern = 20;
                break;
            case 'heavy':
                pattern = 50;
                break;
            case 'selection':
                pattern = [10];
                break;
            case 'impact':
                pattern = [30, 10, 30];
                break;
            case 'notification':
                pattern = [50, 30, 50, 30, 50];
                break;
            default:
                pattern = options.duration || 10;
        }

        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    // Convenience methods
    public light(duration?: number) {
        this.feedback('light', { duration });
    }

    public medium(duration?: number) {
        this.feedback('medium', { duration });
    }

    public heavy(duration?: number) {
        this.feedback('heavy', { duration });
    }

    public selection() {
        this.feedback('selection');
    }

    public impact() {
        this.feedback('impact');
    }

    public notification() {
        this.feedback('notification');
    }

    // Button interaction feedback
    public buttonPress() {
        this.feedback('light');
    }

    public buttonHold() {
        this.feedback('medium');
    }

    // Swipe feedback
    public swipeStart() {
        this.feedback('light');
    }

    public swipeEnd() {
        this.feedback('medium');
    }

    // Success/Error feedback
    public success() {
        this.feedback('notification');
    }

    public error() {
        if (this.vibrationAPI) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    // Check if haptic feedback is available
    public isAvailable(): boolean {
        return this.isSupported;
    }
}

// Create singleton instance
const hapticFeedback = HapticFeedback.getInstance();

// Export convenience functions
export const useHapticFeedback = () => {
    return {
        light: (duration?: number) => hapticFeedback.light(duration),
        medium: (duration?: number) => hapticFeedback.medium(duration),
        heavy: (duration?: number) => hapticFeedback.heavy(duration),
        selection: () => hapticFeedback.selection(),
        impact: () => hapticFeedback.impact(),
        notification: () => hapticFeedback.notification(),
        buttonPress: () => hapticFeedback.buttonPress(),
        buttonHold: () => hapticFeedback.buttonHold(),
        swipeStart: () => hapticFeedback.swipeStart(),
        swipeEnd: () => hapticFeedback.swipeEnd(),
        success: () => hapticFeedback.success(),
        error: () => hapticFeedback.error(),
        isAvailable: () => hapticFeedback.isAvailable(),
        feedback: (type: HapticFeedbackType, options?: HapticOptions) =>
            hapticFeedback.feedback(type, options),
    };
};

export default hapticFeedback;
