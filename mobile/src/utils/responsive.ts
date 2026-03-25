import { Dimensions } from 'react-native';

const SCREEN_H = Dimensions.get('window').height;

/**
 * Returns a responsive value based on screen height breakpoints.
 * small: height < 700 (compact phones)
 * medium: height 700–849 (standard phones)
 * large: height >= 850 (large phones / tablets)
 */
export function getResponsiveValue(small: number, medium: number, large: number): number {
    if (SCREEN_H < 700) return small;
    if (SCREEN_H < 850) return medium;
    return large;
}

export { SCREEN_H };
