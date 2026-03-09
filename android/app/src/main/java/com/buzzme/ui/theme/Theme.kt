package com.buzzme.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val BuzzMeDarkColorScheme = darkColorScheme(
    primary = NeonYellow,
    onPrimary = PureBlack,
    background = PureBlack,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = CardDark,
    onSurfaceVariant = TextSecondary,
    secondary = GreenOnline,
    error = RedDanger
)

@Composable
fun BuzzMeTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = BuzzMeDarkColorScheme,
        typography = BuzzMeTypography,
        content = content
    )
}
